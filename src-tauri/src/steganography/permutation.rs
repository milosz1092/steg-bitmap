use crate::utils::hash::string_to_hash64;
use rand::prelude::*;
use rand_chacha::ChaCha20Rng;
use std::collections::HashSet;

pub struct Permutation {
    img_width: u32,
    img_height: u32,
    repeats: HashSet<String>,
    rng: ChaCha20Rng,
}

impl Permutation {
    pub fn new(width: u32, height: u32, seed: &String) -> Self {
        let hashed_seed = string_to_hash64(seed);

        Self {
            img_width: width,
            img_height: height,
            repeats: HashSet::new(),
            rng: ChaCha20Rng::seed_from_u64(hashed_seed),
        }
    }

    fn get_repeat_key(&self, i: u32, j: u32) -> String {
        format!("{},{}", i, j)
    }

    pub fn next(&mut self) -> (u32, u32) {
        let mut x: u32 = self.rng.gen_range(0..self.img_width);
        let mut y: u32 = self.rng.gen_range(0..self.img_height);

        loop {
            match self.repeats.get(&self.get_repeat_key(x, y)) {
                Some(_) => {
                    x = self.rng.gen_range(0..self.img_width);
                    y = self.rng.gen_range(0..self.img_height);
                }
                _ => {
                    self.repeats.insert(self.get_repeat_key(x, y));
                    break;
                }
            }
        }

        (x, y)
    }
}
