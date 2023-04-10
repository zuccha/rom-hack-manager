// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::{Path, PathBuf};

#[tauri::command]
fn path_exists(path: &str) -> bool {
  Path::new(path).exists()
}

#[tauri::command]
fn validate_name(name: &str) -> Result<(), String> {
  if name.is_empty() { return Err("No name has been specified".into()) }
  Ok(())
}

#[tauri::command]
fn validate_directory_path(path: &str) -> Result<(), String> {
  if path.is_empty() { return Err("No directory has been specified".into()) }
  if !Path::new(path).exists() { return Err("Directory doesn't exist".into()) }
  Ok(())
}

#[tauri::command]
fn validate_vanilla_rom_path(path: &str) -> Result<(), String> {
  if path.is_empty() { return Err("No vanilla ROM has been specified".into()) }
  if !Path::new(path).exists() { return Err("Vanilla ROM doesn't exist".into()) }
  Ok(())
}

#[tauri::command]
fn validate_url(url: &str) -> Result<(), String> {
  if url.is_empty() { return Err("No URL has been specified".into()) }
  Ok(())
}

#[tauri::command]
async fn download_hack(name: &str, directory_path: &str, url: &str, vanilla_rom_path: &str) -> Result<(), String> {
  // Validate Directory
  match validate_directory_path(directory_path) {
    Err(e) => return Err(e),
    _ => (),
  }

  // Validate Vanilla ROM
  match validate_vanilla_rom_path(vanilla_rom_path) {
    Err(e) => return Err(e),
    _ => (),
  }

  // Validate URL
  match validate_url(url) {
    Err(e) => return Err(e),
    _ => (),
  }

  // Build paths
  let hack_directory_path = PathBuf::from(directory_path).join(name);
  let mut hack_zip_path = PathBuf::from(hack_directory_path);
  hack_zip_path.set_extension("zip");

  // Download
  let response = match reqwest::get(url).await {
    Err(_) => return Err("Failed to download zip".into()),
    Ok(r) => r,
  };

  let mut content = match response.bytes().await {
    Err(_) => return Err("Failed to download zip".into()),
    Ok(r) => std::io::Cursor::new(r)
  };

  let mut hack_zip_file = match std::fs::File::create(hack_zip_path) {
    Err(_) => return Err("Failed to create zip".into()),
    Ok(r) => r
  };

  match std::io::copy(&mut content, &mut hack_zip_file) {
    Err(_) => return Err("Failed to create zip".into()),
    Ok(r) => r
  };

  // Unzip
  // Remove zip
  // Patch

  // Return
  Ok(())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      download_hack,
      path_exists,
      validate_directory_path,
      validate_name,
      validate_url,
      validate_vanilla_rom_path,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
