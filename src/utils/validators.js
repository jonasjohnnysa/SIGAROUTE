class Validators {
  static isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(telefone) {
    const apenasNumeros = telefone.replace(/\D/g, '');
    return /^(\d{10}|\d{11})$/.test(apenasNumeros);
  }

  static isCEP(cep) {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep);
  }

  static isValidState(estado) {
    const estadosValidos = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    return estadosValidos.includes(estado.toUpperCase());
  }

  static isEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }

  static isArray(value) {
    return Array.isArray(value);
  }

  static sanitizeString(str) {
    return str.trim();
  }

  static validateLength(str, minLength, maxLength) {
    const length = str.length;
    return length >= minLength && length <= maxLength;
  }
}

module.exports = Validators;
