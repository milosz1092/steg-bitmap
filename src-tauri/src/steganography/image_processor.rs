use crate::steganography::encryption::{decrypt, encrypt, get_text_bytes_with_padding};
use crate::steganography::permutation::Permutation;
use crate::utils::bits_sequence_checker::BitsSequenceChecker;
use bitvec::prelude::*;
use bitvec::vec::BitVec;
use bmp::{open, Image};
use num_traits::PrimInt;

pub struct ImageProcessor {
    image: Option<Image>,
    pixels_count: u32,
}

const ENDING_SEQUENCE: [bool; 32] = [
    true, false, true, false, false, false, true, false, true, false, true, true, true, false,
    true, true, true, false, true, false, false, false, false, false, false, true, false, true,
    false, true, false, true,
];

fn add_ending_sequence(bit_vector: &mut BitVec<u8>) {
    for value in ENDING_SEQUENCE {
        bit_vector.push(value);
    }
}

fn get_lsb<N: PrimInt>(n: N) -> N {
    n & N::one()
}

impl ImageProcessor {
    pub fn new() -> Self {
        Self {
            image: Option::None,
            pixels_count: 0,
        }
    }

    pub fn open_image(&mut self, filepath: &String) -> bool {
        self.image = Option::None;
        let read_result = open(filepath);

        match read_result {
            Ok(image) => {
                self.pixels_count = image.get_width() * image.get_height();
                self.image = Some(image);
                return true;
            }
            Err(_) => return false,
        }
    }

    pub fn save_image(&mut self, filepath: &str) -> bool {
        match &self.image {
            Some(image) => match image.save(filepath) {
                Ok(_) => {
                    return true;
                }
                Err(_) => return false,
            },
            None => {
                return false;
            }
        }
    }

    pub fn get_empty_space_percent(&mut self, message: &String) -> f32 {
        match &self.image {
            Some(_) => {
                let needed_bits_len =
                    (get_text_bytes_with_padding(message).len() * 8 + ENDING_SEQUENCE.len()) as f32;

                let image_capacity = (self.pixels_count * 2) as f32;
                let bits_left = image_capacity - needed_bits_len;

                bits_left / image_capacity
            }
            _ => 1.0,
        }
    }

    pub fn embed_message(
        &mut self,
        message: &String,
        encryption_key: &String,
        distribution_key: &String,
    ) -> bool {
        let image = self.image.as_mut();
        let mut encrypted_message_bits = encrypt(message, encryption_key);
        add_ending_sequence(&mut encrypted_message_bits);
        let mut bits_iterator = encrypted_message_bits.into_iter().peekable();

        match image {
            Some(image) => {
                let message_bit_count = bits_iterator.len();

                // In one pixel we can save two bits using parity control.
                if self.pixels_count < (message_bit_count / 2).try_into().unwrap() {
                    return false;
                }

                let mut permutation =
                    Permutation::new(image.get_width(), image.get_height(), distribution_key);

                loop {
                    let (x, y) = permutation.next();

                    let (bit_first, bit_second) = (
                        bits_iterator.next().unwrap() as u8,
                        bits_iterator.next().unwrap() as u8,
                    );

                    let mut pixel = image.get_pixel(x, y);

                    let lsb_r: u8 = get_lsb(pixel.r);
                    let lsb_g: u8 = get_lsb(pixel.g);
                    let lsb_b: u8 = get_lsb(pixel.b);

                    if bit_first != (lsb_r ^ lsb_b) && bit_second == (lsb_g ^ lsb_b) {
                        pixel.r ^= 1 << 0;
                    }

                    if bit_first == (lsb_r ^ lsb_b) && bit_second != (lsb_g ^ lsb_b) {
                        pixel.g ^= 1 << 0;
                    }

                    if bit_first != (lsb_r ^ lsb_b) && bit_second != (lsb_g ^ lsb_b) {
                        pixel.b ^= 1 << 0;
                    }

                    image.set_pixel(x, y, pixel);

                    if bits_iterator.peek().is_none() {
                        break;
                    }
                }

                true
            }
            _ => false,
        }
    }

    pub fn fetch_message(&mut self, encryption_key: &String, distribution_key: &String) -> String {
        let image = self.image.as_mut();
        let mut bit_vector = bitvec!();
        let empty_string = String::new();

        match image {
            Some(image) => {
                let mut permutation =
                    Permutation::new(image.get_width(), image.get_height(), distribution_key);
                let mut end_sequence_checker = BitsSequenceChecker::<32>::new(&ENDING_SEQUENCE);

                for _ in 0..self.pixels_count {
                    let (x, y) = permutation.next();

                    let pixel = image.get_pixel(x, y);

                    let lsb_r: u8 = get_lsb(pixel.r);
                    let lsb_g: u8 = get_lsb(pixel.g);
                    let lsb_b: u8 = get_lsb(pixel.b);

                    let bits_pair: [bool; 2] = [(lsb_r ^ lsb_b) == 1, (lsb_g ^ lsb_b) == 1];

                    bit_vector.push(bits_pair[0]);
                    bit_vector.push(bits_pair[1]);
                    end_sequence_checker.update(&bits_pair);

                    if end_sequence_checker.is_recogized() {
                        bit_vector.drain(bit_vector.len() - ENDING_SEQUENCE.len()..);

                        let decrypted_message = decrypt(bit_vector, encryption_key);
                        return decrypted_message;
                    }
                }

                return empty_string;
            }
            _ => empty_string,
        }
    }
}
