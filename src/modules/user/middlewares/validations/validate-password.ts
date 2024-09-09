import { ErrorItem } from "../../../../types/error-type";

export const validatePassword = (password: string): boolean => {
  let M = 0;
  let m = 0;
  let n = 0;
  let c = 0;

  for (let i = 0; i < password.length; i++) {
    if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
      M = 1;
    }
    if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
      m = 1;
    }
    if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
      n = 1;
    }
    if (
      (password.charCodeAt(i) >= 33 && password.charCodeAt(i) <= 47) ||
      (password.charCodeAt(i) >= 58 && password.charCodeAt(i) <= 64) ||
      (password.charCodeAt(i) >= 91 && password.charCodeAt(i) <= 96) ||
      (password.charCodeAt(i) >= 123 && password.charCodeAt(i) <= 126)
    ) {
      c = 1;
    }
  }

  if (M === 1 && m === 1 && n === 1 && c === 1 && password.length >= 8) {
    return true;
  }

  return false;
};

export const errorPassword = (password: string): ErrorItem[] => {
  let M = 0;
  let m = 0;
  let n = 0;
  let c = 0;

  const errors: ErrorItem[] = [];

  for (let i = 0; i < password.length; i++) {
    if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
      M = 1;
    }
    if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
      m = 1;
    }
    if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
      n = 1;
    }
    if (
      (password.charCodeAt(i) >= 33 && password.charCodeAt(i) <= 47) ||
      (password.charCodeAt(i) >= 58 && password.charCodeAt(i) <= 64) ||
      (password.charCodeAt(i) >= 91 && password.charCodeAt(i) <= 96) ||
      (password.charCodeAt(i) >= 123 && password.charCodeAt(i) <= 126)
    ) {
      c = 1;
    }
  }

  if (M === 0)
    errors.push({
      error: "USR-004",
      message: "Missing a uppercase letter",
    });

  if (m === 0)
    errors.push({
      error: "USR-005",
      message: "Missing a lowercase letter",
    });

  if (c === 0)
    errors.push({
      error: "USR-006",
      message: "Missing a special letter",
    });

  if (n === 0)
    errors.push({
      error: "USR-007",
      message: "Missing a number",
    });

  if (password.length < 8)
    errors.push({
      error: "USR-00",
      message: "Password length is wrong",
    });

  return errors;
};
