export default function(getState, comment) {
  const state = getState();
  let email = state.info.email;
  let egroups = state.info.egroups;
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.ENV === 'development'
  ) {
    email = 'fespinos@cern.ch';
    // egroups = 'cms-dqm-runregistry-experts';
    egroups = 'cms-dqm-runregistry-offline-csc-certifiers'; // For testing
  }
  const options = {
    headers: { egroups, email }
  };
  if (comment) {
    options.headers.comment = comment;
  }
  return options;
}
