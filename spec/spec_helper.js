function parameterize(parameters, func) {
  for (var i = 0; i < parameters.length; ++i) {
    func.apply(this, parameters[i]);
  }
}
