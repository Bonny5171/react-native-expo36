import squel from 'squel';

squel.registerValueHandler('boolean', function(v) {
  return v ? "'true'": "'false'";
});

// squel.registerValueHandler('string', function(v) {
//   return v  === null ? "*vazio": v;
// });

export default squel;