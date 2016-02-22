/**
 * Created by Vunb on 2.23.2016.
 */
module.exports = {
  angularJSApiDemo: function (req, res) {
    var rules = [
      {id: 1, ruleName: 'Tài khoản phải có 5 ký tự'},
      {id: 2, ruleName: 'Tài khoản chưa được sử dụng'},
      {id: 3, ruleName: 'Tài khoản có ý nghĩa 1 chút'}
    ];

    res.json(rules);
  }
};
