use std::io::Read;

use aes::cipher::generic_array::typenum;
use aes::cipher::{generic_array::GenericArray, BlockDecrypt, BlockEncrypt, KeyInit};
use aes::Aes256;
use bitvec::prelude::*;
use bitvec::vec::BitVec;
use sha2::{Digest, Sha256};

fn generate_blocks(message_bytes: &Vec<u8>) -> Vec<GenericArray<u8, typenum::U16>> {
    let mut blocks: Vec<GenericArray<u8, typenum::U16>> = vec![];
    let bytes_as_chunks = message_bytes.chunks(16);
    for chunk in bytes_as_chunks {
        let mut fixed_chunk: [u8; 16] = [0; 16];
        fixed_chunk.copy_from_slice(&chunk[0..16]);
        blocks.insert(0, GenericArray::from_iter(fixed_chunk));
    }
    blocks
}

fn blocks_to_flat_vector(blocks: Vec<GenericArray<u8, typenum::U16>>) -> Vec<u8> {
    blocks
        .into_iter()
        .flat_map(|block| block.to_vec())
        .collect()
}

fn get_text_bytes_with_padding(text: &String) -> Vec<u8> {
    let block_padding = text.bytes().len() % 16;

    let mut plain_text_with_padding = String::from(text);
    if block_padding > 0 {
        plain_text_with_padding.insert_str(text.len(), &" ".repeat(16 - block_padding));
    }

    plain_text_with_padding.bytes().collect()
}

fn get_aes(cipher_key: &String) -> Aes256 {
    let mut hasher = Sha256::new();
    hasher.update(cipher_key);
    let cipher_key_hash = hasher.finalize();

    Aes256::new(&cipher_key_hash)
}

pub fn encrypt(plain_text: &String, plain_cipher_key: &String) -> BitVec<u8> {
    let aes = get_aes(plain_cipher_key);
    let plain_text_bytes: Vec<u8> = get_text_bytes_with_padding(plain_text);

    let mut blocks = generate_blocks(&plain_text_bytes);

    aes.encrypt_blocks(&mut blocks);
    let one_enc_vec: Vec<u8> = blocks_to_flat_vector(blocks);

    let bits_vector = one_enc_vec.view_bits::<Lsb0>().to_bitvec();
    bits_vector
}

pub fn decrypt(encrypted_bits: BitVec, plain_cipher_key: &String) -> String {
    let aes = get_aes(plain_cipher_key);

    let encrypted_bytes: Vec<u8> = encrypted_bits.bytes().map(|byte| byte.unwrap()).collect();
    let mut blocks = generate_blocks(&encrypted_bytes);

    aes.decrypt_blocks(&mut blocks);
    let one_decrypt_vector: Vec<u8> = blocks_to_flat_vector(blocks);

    let decrypted_message = String::from_utf8(one_decrypt_vector).unwrap_or(String::new());
    decrypted_message.trim().to_string()
}
