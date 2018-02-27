/**
 * Created by CDejarl1 on 9/11/2017.
 */

const setup = require('webdev-setup-tools');
const JdkInstaller = require('webdev-setup-tools-java');

async function install(){
  await JdkInstaller.installJava();

  setup.endProcessWithMessage('Installed external tools.', 1 , 0);
}

install();