pub struct BitsSequenceChecker<'a, const N: usize> {
    sequence: &'a [bool; N],
    checking_buffer: [bool; N],
    seq_len: usize,
}

impl<'a, const N: usize> BitsSequenceChecker<'a, N> {
    pub fn new(seq: &'a [bool; N]) -> Self {
        Self {
            sequence: seq,
            seq_len: seq.len(),
            checking_buffer: [false; N],
        }
    }

    pub fn update(&mut self, bits_pair: &[bool; 2]) {
        for bit in bits_pair {
            self.checking_buffer.rotate_right(self.seq_len - 1);
            self.checking_buffer[self.seq_len - 1] = *bit;
        }
    }

    pub fn is_recogized(&self) -> bool {
        self.sequence == &self.checking_buffer
    }
}
