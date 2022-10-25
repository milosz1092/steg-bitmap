use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub fn string_to_hash64(text: &String) -> u64 {
    let mut hasher = DefaultHasher::new();
    text.hash(&mut hasher);
    hasher.finish()
}
