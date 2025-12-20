// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::path::{Path, PathBuf};
use reqwest::header;

fn decode_url_component(component: &str) -> String {
  let replaced = component.replace('+', " ");
  urlencoding::decode(&replaced)
    .map(|cow| cow.into_owned())
    .unwrap_or_else(|_| replaced)
}

fn expand_tilde(path: &str) -> String {
  if let Some(rest) = path.strip_prefix("~") {
    if let Ok(home) = std::env::var("HOME") {
      if rest.is_empty() {
        return home;
      }
      let mut buf = PathBuf::from(home);
      let trimmed_rest = rest.trim_start_matches(&['/', '\\'][..]);
      if !trimmed_rest.is_empty() {
        buf.push(trimmed_rest);
      }
      return buf.to_string_lossy().into_owned();
    }
  }
  path.to_string()
}

fn flatten_directory(dir_path: &Path) -> Result<(), String> {
  let mut dir = match dir_path.read_dir() {
    Err(_) => return Err("Failed to read directory".into()),
    Ok(o) => o
  };

  // If directory is empty, do nothing.
  let entry = match dir.next() {
    None => return Ok(()),
    Some(Err(_)) => return Err("Failed to read directory".into()),
    Some(Ok(o)) => o
  };

  // If directory contains more than one entry, do nothing.
  if dir.count() > 1 { return Ok(()) }

  // If the only entry is not a directory, do nothing.
  match entry.metadata() {
    Err(_) => return Err("Failed to read entry metadata".into()),
    Ok(o) => if !o.is_dir() { return Ok(()) }
  };

  // If the only entry is a directory, move all it's entries up by one level.
  let mut temp_dir_path = PathBuf::from(dir_path);
  temp_dir_path.set_file_name(dir_path.file_name().unwrap().to_str().unwrap().to_owned() + "_tmp");

  match std::fs::rename(entry.path(), &temp_dir_path) {
    Err(_) => return Err("Failed to move single sub directory to temp directory".into()),
    _s => ()
  };

  match std::fs::remove_dir(dir_path) {
    Err(_) => return Err("Failed to removes directory".into()),
    _s => ()
  };

  match std::fs::rename(&temp_dir_path, dir_path) {
    Err(_) => return Err("Failed to move temp directory to directory".into()),
    _s => ()
  };

  Ok(())
}

#[tauri::command]
fn path_exists(path: &str) -> bool {
  let expanded = expand_tilde(path);
  Path::new(&expanded).exists()
}

#[tauri::command]
fn validate_name(name: &str) -> Result<(), String> {
  if name.is_empty() { return Err("No name has been specified".into()) }
  for c in name.chars() {
    match c {
      '"' => return Err("Name cannot contain character \"\"\"".into()),
      '*' => return Err("Name cannot contain character \"*\"".into()),
      '/' => return Err("Name cannot contain character \"/\"".into()),
      ':' => return Err("Name cannot contain character \":\"".into()),
      '<' => return Err("Name cannot contain character \"<\"".into()),
      '>' => return Err("Name cannot contain character \">\"".into()),
      '?' => return Err("Name cannot contain character \"?\"".into()),
      '\\' => return Err("Name cannot contain character \\\"".into()),
      '|' => return Err("Name cannot contain character \"|\"".into()),
      _ => ()
    };
  }
  Ok(())
}

#[tauri::command]
fn validate_directory_path(path: &str) -> Result<(), String> {
  let expanded = expand_tilde(path);
  if expanded.is_empty() { return Err("No directory has been specified".into()) }
  if !Path::new(&expanded).exists() { return Err("Directory doesn't exist".into()) }
  let metadata = match std::fs::metadata(&expanded) {
    Err(_) => return Err("This is not a valid path".into()),
    Ok(m) => m
  };
  if !metadata.is_dir() { return Err("This is not a directory".into()) }
  Ok(())
}

#[tauri::command]
fn validate_file_path(path: &str) -> Result<(), String> {
  let expanded = expand_tilde(path);
  if expanded.is_empty() { return Err("No file has been specified".into()) }
  if !Path::new(&expanded).exists() { return Err("File doesn't exist".into()) }
  let metadata = match std::fs::metadata(&expanded) {
    Err(_) => return Err("This is not a valid path".into()),
    Ok(m) => m
  };
  if !metadata.is_file() { return Err("This is not a file".into()) }
  Ok(())
}

#[tauri::command]
fn validate_url(url: &str) -> Result<(), String> {
  if url.is_empty() { return Err("No URL has been specified".into()) }
  Ok(())
}

#[tauri::command]
fn open_with_default_app(path: &str) -> Result<(), String> {
  match open::that(path) {
    Err(_) => return Err("Failed to open path".into()),
    _ => ()
  };
  Ok(())
}

#[tauri::command]
fn open_with_selected_app(file_path: &str, emulator_path: &str, emulator_args: &str) -> Result<(), String> {
  let args = match shell_words::split(emulator_args) {
    Err(_) => return Err("Failed to parse emulator arguments".into()),
    Ok(a) => a
  };
  let mut command = std::process::Command::new(emulator_path);
  for arg in args {
      command.arg(if arg == "%1" { file_path } else { &arg });
  }
  command.spawn()
      .map_err(|e| e.to_string())?;

  Ok(())
}

#[tauri::command]
async fn download_hack(
  app_handle: tauri::AppHandle,
  game_directory: &str,
  game_original_copy: &str,
  hack_name: &str,
  hack_download_url: &str,
  cookie: &str,
  open_hack_folder_after_download: bool) -> Result<(), String> {
  // Validate Directory
  match validate_directory_path(game_directory) {
    Err(e) => return Err(e),
    _ => (),
  }


  // Validate Vanilla ROM
  match validate_file_path(game_original_copy) {
    Err(e) => return Err(e),
    _ => (),
  }

  // Build paths
  let expanded_game_directory = expand_tilde(game_directory);
  let expanded_game_original_copy = expand_tilde(game_original_copy);

  let is_remote = hack_download_url.starts_with("http://") || hack_download_url.starts_with("https://");

  let effective_hack_name = if hack_name.trim().is_empty() {
    if is_remote {
      let without_query = hack_download_url.split('?').next().unwrap_or(hack_download_url);
      let last_segment = without_query.rsplit('/').next().unwrap_or("hack");
      let decoded_segment = decode_url_component(last_segment);
      let stem = Path::new(&decoded_segment)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("hack");
      if stem.is_empty() {
        "hack".to_string()
      } else {
        stem.to_string()
      }
    } else {
      let expanded_hack_download_url = expand_tilde(hack_download_url);
      let local_path = Path::new(&expanded_hack_download_url);
      let stem = local_path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("hack");
      let decoded_stem = decode_url_component(stem);
      if decoded_stem.is_empty() {
        "hack".to_string()
      } else {
        decoded_stem
      }
    }
  } else {
    hack_name.to_string()
  };

  let hack_directory_path = PathBuf::from(&expanded_game_directory).join(&effective_hack_name);

  if is_remote {
    // Validate URL
    match validate_url(hack_download_url) {
      Err(e) => return Err(e),
      _ => (),
    }

    // Create a reqwest client with custom cookie
    let client = reqwest::Client::builder()
      .default_headers({
        let mut headers = header::HeaderMap::new();
        headers.insert(header::COOKIE, header::HeaderValue::from_str(cookie).unwrap());
        headers
      })
      .build()
      .unwrap();

    // Issue a GET request with the custom client
    let response = match client.get(hack_download_url).send().await {
      Err(_) => return Err("Failed to download zip".into()),
      Ok(r) => r,
    };

    // Log error if response is not 200
    if response.status() != 200 {
      println!("Failed to download zip: {}", response.status());
      return Err("Failed to download zip".into())
    }

    let content = match response.bytes().await {
      Err(_) => return Err("Failed to download zip".into()),
      Ok(r) => std::io::Cursor::new(r)
    };

    println!("Dowloaded zip");
    println!("Zip size: {}", content.get_ref().len());

    // Unzip
    match zip_extract::extract(content, hack_directory_path.as_path(), false) {
      Err(_) => return Err("Failed to extract zip".into()),
      _ => ()
    };
  } else {
    // Validate local zip file path
    match validate_file_path(hack_download_url) {
      Err(e) => return Err(e),
      _ => (),
    }

    let expanded_hack_download_url = expand_tilde(hack_download_url);
    let local_zip_path = Path::new(&expanded_hack_download_url);

    match local_zip_path.extension().and_then(|ext| ext.to_str()) {
      Some(ext) if ext.eq_ignore_ascii_case("zip") => (),
      _ => return Err("This is not a zip file".into()),
    }

    let file = match std::fs::File::open(local_zip_path) {
      Err(_) => return Err("Failed to open zip".into()),
      Ok(f) => f,
    };

    println!("Using local zip: {}", hack_download_url);

    // Unzip
    match zip_extract::extract(std::io::BufReader::new(file), hack_directory_path.as_path(), false) {
      Err(_) => return Err("Failed to extract zip".into()),
      _ => ()
    };
  }

  // Flatten directory if necessary
  match flatten_directory(&hack_directory_path) {
    Err(e) => return Err("Failed to flatten hack directory: ".to_string() + &e),
    _ => ()
  };

  // Retrieve Flips
  let flips_command = match std::env::consts::OS {
    "macos" => "multipatch",
    "windows" => "flips.exe",
    _ => ""
  };

  let flips_path = match app_handle
    .path()
    .resolve(Path::new("resources").join(flips_command), tauri::path::BaseDirectory::Resource)
  {
    Ok(p) => p,
    Err(_) => return Err("Failed to locate Flips".into()),
  };

  if !flips_path.exists() {
    return Err("Failed to retrieve Flips".into())
  }

  // Patch
  hack_directory_path.read_dir().unwrap()
    .filter_map(|res| res.ok())
    .map(|dir_entry| dir_entry.path())
    .filter(|path| {
      path
        .extension()
        .map_or(false, |ext| ext == "bps" || ext == "ips")
    })
    .for_each(|bps_path| {
      let mut sfc_path = PathBuf::from(&bps_path);
      sfc_path.set_extension("sfc");
      std::process::Command::new(&flips_path)
        .arg("--apply")
        .arg(&bps_path)
        .arg(&expanded_game_original_copy)
        .arg(&sfc_path)
        .spawn()
        .unwrap();
    });

  // Open hack directory (ignore errors, if it fails we don't care)
  if open_hack_folder_after_download {
    let _ = open::that(hack_directory_path);
  }

  // All good
  Ok(())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      download_hack,
      open_with_default_app,
      open_with_selected_app,
      path_exists,
      validate_directory_path,
      validate_file_path,
      validate_name,
      validate_url,
      ])
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
