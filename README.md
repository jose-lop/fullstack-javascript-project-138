# Page Loader

[![Node CI](https://github.com/jose-lop/fullstack-javascript-project-138/actions/workflows/nodejs.yml/badge.svg)](https://github.com/jose-lop/fullstack-javascript-project-138/actions)

[![Maintainability](https://api.codeclimate.com/v1/badges/17afe6a5-0450-43f5-8e84-234871a7485d/maintainability)](https://codeclimate.com/github/jose-lop/fullstack-javascript-project-138/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/17afe6a5-0450-43f5-8e84-234871a7485d/test_coverage)](https://codeclimate.com/github/jose-lop/fullstack-javascript-project-138/test_coverage)

## Description

**Page Loader** is a command-line utility that downloads web pages and saves them locally.

The program downloads the HTML content of a page and stores it in a file inside a specified directory.
If no directory is specified, the page is saved in the current working directory.

This project is part of the **Hexlet Fullstack JavaScript Developer program**.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jose-lop/fullstack-javascript-project-138.git
cd fullstack-javascript-project-138
npm install
```

---

## Usage

Run the CLI command:

```bash
page-loader https://example.com
```

Example:

```bash
page-loader https://example.com
```

Example output:

```
Downloading https://example.com
Page saved as example-com.html
```

---

## Options

Specify the output directory:

```bash
page-loader --output /path/to/directory https://example.com
```

Example:

```bash
page-loader --output ./pages https://example.com
```

---

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Fix ESLint issues automatically:

```bash
npm run lint:fix
```

---

## Project Structure

```
.
├── bin
│   └── page-loader.js
├── src
│   └── pageLoader.js
├── __tests__
│   └── pageLoader.test.js
├── .github
│   └── workflows
│       └── nodejs.yml
├── .eslintrc.yml
├── .codeclimate.yml
├── package.json
└── README.md
```

---

## Technologies

- Node.js
- Axios
- Commander
- Jest
- Nock
- ESLint (Airbnb style guide)
- GitHub Actions
- Code Climate / Qlty

---

## License

MIT

# Automatic tests

After completing all the steps in the project, automatic tests will become available to you. Tests are run on each commit - once all tasks in the Hexlet interface are completed, make a commit, and the tests will run automatically.

The hexlet-check.yml file is responsible for running these tests - do not delete this file, edit it, or rename the repository.

### Hexlet tests and linter status:

[![Actions Status](https://github.com/jose-lop/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/jose-lop/fullstack-javascript-project-138/actions)

## Demo

[![asciicast](https://asciinema.org/a/dRgz5kuVOht6ogVm.svg)](https://asciinema.org/a/dRgz5kuVOht6ogVm)

## Demo Stage 2

[![asciicast](https://asciinema.org/a/xwChs6fhKfUfUZb4.svg)](https://asciinema.org/a/xwChs6fhKfUfUZb4)

## Debug demo

[![asciicast](https://asciinema.org/a/XaPxe6Ns7QxJ1Zh6.svg)](https://asciinema.org/a/XaPxe6Ns7QxJ1Zh6)

## Error handling demo

Example of execution when a network error occurs and the program exits with code 1:

[![asciicast](https://asciinema.org/a/RpeN9B4ReYqViRvA.svg)](https://asciinema.org/a/RpeN9B4ReYqViRvA)

## Progress demonstration

Example of parallel resource downloading with Listr progress visualization:

[![asciicast](https://asciinema.org/a/N9QbzxIov4UA8Wmp.svg)](https://asciinema.org/a/N9QbzxIov4UA8Wmp)
