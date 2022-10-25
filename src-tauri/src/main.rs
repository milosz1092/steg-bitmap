#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod steganography;
mod utils;

use std::sync::Mutex;
use steganography::ImageProcessor;

struct SecondState(u8);

struct AppState {
    processor: ImageProcessor,
}
struct MutAppState(Mutex<AppState>);

#[tauri::command]
async fn read_file(state: tauri::State<'_, MutAppState>, filepath: String) -> Result<bool, bool> {
    let mut mutable_state = state.0.lock().unwrap();
    let read_result = mutable_state.processor.open_image(&filepath);

    Result::Ok(read_result)
}

#[tauri::command]
async fn save_file(state: tauri::State<'_, MutAppState>, filepath: String) -> Result<bool, bool> {
    let mut mutable_state = state.0.lock().unwrap();
    let save_result = mutable_state.processor.save_image(&filepath);

    Result::Ok(save_result)
}

#[tauri::command]
async fn embed_message(
    state: tauri::State<'_, MutAppState>,
    message: String,
    encryption_key: String,
    distribution_key: String,
) -> Result<bool, bool> {
    let mut mutable_state = state.0.lock().unwrap();
    let embedding_result =
        mutable_state
            .processor
            .embed_message(&message, &encryption_key, &distribution_key);

    Result::Ok(embedding_result)
}

#[tauri::command]
async fn fetch_message(
    state: tauri::State<'_, MutAppState>,
    encryption_key: String,
    distribution_key: String,
) -> Result<String, String> {
    let mut mutable_state = state.0.lock().unwrap();
    let fetching_result = mutable_state
        .processor
        .fetch_message(&encryption_key, &distribution_key);

    Result::Ok(fetching_result)
}

fn main() {
    tauri::Builder::default()
        .manage(MutAppState(Mutex::new(AppState {
            processor: ImageProcessor::new(),
        })))
        .manage(SecondState(128))
        .invoke_handler(tauri::generate_handler![
            read_file,
            embed_message,
            fetch_message,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
