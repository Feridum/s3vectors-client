use aws_config::{BehaviorVersion, Region};
use serde_json::{json, Value};
use aws_smithy_types::{Document, Number};

// Helper function to convert aws_smithy_types::Document to serde_json::Value
fn document_to_value(doc: &Document) -> Value {
    match doc {
        Document::Object(map) => {
            let map: serde_json::Map<String, Value> =
                map.iter().map(|(k, v)| (k.clone(), document_to_value(v))).collect();
            Value::Object(map)
        }
        Document::Array(vec) => Value::Array(vec.iter().map(document_to_value).collect()),
        Document::Number(n) => match n {
            Number::Float(f) => json!(f),
            Number::PosInt(i) => json!(i),
            Number::NegInt(i) => json!(i),
        },
        Document::String(s) => Value::String(s.clone()),
        Document::Bool(b) => Value::Bool(*b),
        Document::Null => Value::Null,
    }
}

async fn get_client(region: String)->aws_sdk_s3vectors::client::Client {
    let config = aws_config::defaults(BehaviorVersion::latest())
        .region(Region::new(region))
        .load()
        .await;

    aws_sdk_s3vectors::Client::new(&config)
}

#[tauri::command]
async fn get_bucket_list(region: String) -> Result<String, String> {
    let client = get_client(region).await;

    match client.list_vector_buckets().send().await {
            Ok(output) => {
                let buckets: Vec<serde_json::Value> = output.vector_buckets()
                    .iter()
                    .map(|bucket| {
                        let name = bucket.vector_bucket_name().to_string();
                        let arn = bucket.vector_bucket_arn().to_string();
                        serde_json::json!({
                            "name": name,
                            "arn": arn
                        })
                    })
                    .collect();
                serde_json::to_string(&buckets).map_err(|e| e.to_string())
            },
            Err(err) => Err(err.to_string()),
        }
}

#[tauri::command]
async fn get_bucket_indexes(region: String, bucket: String) -> Result<String, String> {
    let client = get_client(region).await;

    match client.list_indexes().vector_bucket_name(bucket).send().await {
        Ok(output) => {
            let indexes: Vec<serde_json::Value> = output.indexes()
                .iter()
                .map(|index| {
                    serde_json::json!({
                        "indexName": index.index_name(),
                        "vectorBucketName": index.vector_bucket_name(),
                        "indexArn": index.index_arn(),
                        "index_name": index.index_name(),
                    })
                })
                .collect();
            serde_json::to_string(&indexes).map_err(|e| e.to_string())
        },
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
async fn get_bucket_vectors(region: String, bucket: String, index: String) -> Result<String, String> {
    let client = get_client(region).await;

    match client.list_vectors()
        .vector_bucket_name(bucket)
        .index_name(index)
        .return_data(true)
        .return_metadata(true)
        .send().await {
        Ok(output) => {
            let emptyVector:Vec<f32> = Vec::new();
            let vectors: Vec<serde_json::Value> = output.vectors()
                .iter()
                .map(|vector| {
                    serde_json::json!({
                        "key": vector.key(),
                        "data": vector.data().and_then(|v| v.as_float32().ok()).unwrap_or(&emptyVector),
                        "metadata": vector.metadata().map(document_to_value).unwrap_or(serde_json::Value::Null)
                    })
                })
                .collect();
            serde_json::to_string(&vectors).map_err(|e| e.to_string())
        },
        Err(err) => Err(err.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_bucket_list,
            get_bucket_indexes,
            get_bucket_vectors
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}