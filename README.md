# LSB Steganography for Bitmap images

This application allows you to smuggle text in `.bmp` files. It is possible to embed messages and read them from previously processed files.

## Project structure

Whole implementation is broken down into several distinct parts. Code written in [Rust](https://www.rust-lang.org/) is responsible for image processing and cryptography. User interface is created in [TypeScript](https://www.typescriptlang.org/) using the [Svelte](https://svelte.dev/) compiler. Application state and general behavior is developed using [XState](https://xstate.js.org/docs/) and [RxJS](https://rxjs.dev/guide/overview). The whole thing was fastened by [Vite](https://vitejs.dev/) bundler and [Tauri](https://tauri.app/).

The application works as a finite state machine, which significantly affects predictability - transitions from one state to another take place according to strictly defined criteria. Reactive approach with the use of Observables makes it a truly event-driven application. Asynchronous operations performed in Rust runs in separate threads so that the main thread handling the user interface is not blocked. See the main parts:

 - image processing [[dir]](https://github.com/milosz1092/steg-bitmap/tree/main/src-tauri/src/steganography)
 - state machine [[src]](https://github.com/milosz1092/steg-bitmap/blob/main/src/store/StateMachine/StateMachine.config.ts)
 - configuration form [[src]](https://github.com/milosz1092/steg-bitmap/blob/main/src/lib/Form/Form.svelte)

## A bit of theory

All steganographic methods are designed to prevent the detection of the transmission. Relating the above to the problem at hand, after analyzing the bitmap image into which additional information has been injected, we should not discover clear evidence of the existence of hidden data.

### What is Bitmap?

Each bitmap type file can be represented as a two-dimensional array of pixels with a fixed size. In this case, a pixel is a set of three bytes representing unsigned integers. Each of them corresponds to the three colors (Red, Green, and Blue) in turn. The example below shows schema for bitmap with a 3-pixel width and height.

![bmp-schema](https://user-images.githubusercontent.com/5222289/198069720-c0788fdb-1252-4336-b73a-b3fb82739a2c.png)

Above image consists of 9 pixels. Two of them are blue-gray, the others are light-green. Each byte corresponds to the proportion of the corresponding color in the pixel. This works much like mixing the paint of the three primary colors to get the color you want.

### Least significant bit

The LSB of a given variable in memory is the rightmost bit that represents the smallest numerical value. Its toggling causes the smallest possible change of the whole value. Let's look at a specific case, take for example the pixel from [2, 0] position and toggle its least significant bit from red color. The result of the change is presented below.

![toggle-lsb](https://user-images.githubusercontent.com/5222289/198108431-5b61bcce-6e57-4735-98d0-2d434626e237.png)

You may notice that such a slight change translates into virtually imperceptible variations in color. The bluish-gray color after switching the bit may seem a little lighter.

It is worth noting that BMP images with a lot of noise and color transitions (such as in normal photos) are more suitable for steganography. Images with uniform colors without fluctuations, after byte changes can quickly visualize the places of changed pixels.

### Permutation

Generally speaking, the permutation function uniquely transforms the elements of a finite set into another finite set. To refer to the example, let the input set be all the vertical and horizontal coordinates of the bitmap shown above. We want the transform function to return a set of all possible coordinates.

![perm](https://user-images.githubusercontent.com/5222289/198269134-c4e79e5b-12e0-4922-bdba-5ab46d2e99bb.png)

## Implemented image processing [algorithm](https://github.com/milosz1092/steg-bitmap/blob/main/src-tauri/src/steganography/image_processor.rs)

### Embedding

#### 1. Preparing bits before injecting
![embedding-1](https://user-images.githubusercontent.com/5222289/198255093-37f8c3bd-f21e-45cf-9b11-cfaa2f0cfb97.png)

Ending sequence is a constant set of bits that will be used while fetching message to recognize the point when reading bits from pixels should be stopped.

#### 2. Coding bits in bitmap
![embedding-2](https://user-images.githubusercontent.com/5222289/198290899-191836f9-b82f-4de6-867e-e9f18c1c7407.png)

The embedding process uses the parity bit, not to prevent errors, but to convey as much information as possible by changing as few bits as possible in the image. For the given least significant bits of each color value in the pixel, the encoding of the two bits in the pixel is as follows:
<p align="center">
To embed bits $x_1$ and $x_2$ using the LSB locations $a_1$, $a_2$, and $a_3$.
$$x_1 \ne a_1 ⊕ a_3, x_2 = a_2 ⊕ a_3 => toggle(a_1)$$
$$x_1 = a_1 ⊕ a_3, x_2 \ne a_2 ⊕ a_3 => toggle(a_2)$$
$$x_1 \ne a_1 ⊕ a_3, x_2 \ne a_2 ⊕ a_3 => toggle(a_3)$$
$$x_1 = a_1 ⊕ a_3, x_2 = a_2 ⊕ a_3 => nothing$$
</p>

### Fetching

Reading messages from an image is the reverse process of embedding. The user provides the path to the file as well as the cryptographic and distribution key. The algorithm selects pixels using a random coordinate generator, which is fed with salt in the form of a distribution key - therefore the order of the reading pixels will be the same as during embedding. The parsing operation continues until the ending bit sequence is encountered. It then decrypts and returns the text string to the user.

<p align="center">
To fetch two bits $x_1$ and $x_2$ from LSB locations $a_1$, $a_2$, and $a_3$.
$$x_1 = a_1 ⊕ a_3$$
$$x_2 = a_2 ⊕ a_3$$
</p>

## Development note

### Visual Studio Code recommended extensions:

 - `Svelte for VS Code` by Svelte
 - `XState VSCode` by Stately
 
### Visual Studio Code settings for Svelte:
 - `"svelte.plugin.svelte.note-new-transformation": false`
 - `"svelte.enable-ts-plugin": true`
 
### How to run
#### Prequisites
`Rust`, `Node.js` and `Yarn` installed.

#### Installation
`yarn`

#### Starting development version
`yarn tauri dev`
