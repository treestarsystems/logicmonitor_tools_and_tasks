/*
 Fix failed execution on first POST to /functions endpoint
*/
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const core = require('../../server/core/core.js');

const accessId = core.system.logicmonitor.apiID;
const accessKey = core.system.logicmonitor.apiKey;
const company = core.system.logicmonitor.company;

//Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/datasources/get-datasources
async function backupDatasources() {
  //Create required directories and change permissions if they do not exist.
  //Yes I want this to be synchronous but it does need improvement to handle failure.
  let backupsDir = `${core.coreVars.installedDir}/scripts/backup/datasourceBackups`;
  if (!fs.existsSync(backupsDir)) {
    console.log(`Creating: ${backupsDir}`);
    core.createDir(backupsDir);
  }
  let returnObj = { "status": "", "message": "", "payload": "" };
  try {
    let targetReports = [];
    //Per documentation its best to define a filter as a queryParams. If not only 50 items will be returned in the array.
    let datasourcesGetObj = {
      "method": "GET",
      "accessId": accessId,
      "accessKey": accessKey,
      "epoch": (new Date).getTime(),
      "resourcePath": "/setting/datasources",
      "queryParams": "?filter=group:_<CLIENT>",
      "url": function () {
        return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`
      }
    }
    let datasourcesList = await core.genericAPICall(datasourcesGetObj);
    if (datasourcesList.status == "failure") throw datasourcesList.payload;
    //Lets loop through the response and extract the items that match our filter into a new array.
    for (dle of datasourcesList.payload.data.items) {
      //Convert datasource name to a valid file name.
      let fileName = `datasource_${dle.name.replace(/\W/g, "_")}.xml`
      //Full file path. I really dont need this but...
      let fullStoragePath = `${backupsDir}/${fileName}`;
      //Define a new get obj so we can query the API for an XML version of the datasource.
      let datasourcesGetXMLObj = {
        "method": "GET",
        "accessId": accessId,
        "accessKey": accessKey,
        "epoch": (new Date).getTime(),
        "resourcePath": `/setting/datasources/${dle.id}`,
        "queryParams": "?format=xml",
        "url": function () {
          return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`
        }
      }
      let datasourceXMLExport = await core.genericAPICall(datasourcesGetXMLObj);
      if (typeof datasourceXMLExport.payload === 'string') {
        let xmlString = datasourceXMLExport.payload;
        fs.writeFile(fullStoragePath, xmlString, async (err) => {
          if (err) console.log(`FAILED: ${fileName} : ${err}`);
          console.log(`SAVED: ${fileName}`);
        });
      } else {
        console.log(`FAILED: ${fileName} - ${datasourceXMLExport.payload.errmsg}`);
      }
    }
  } catch (e) {
    return core.defaultErrorHandler(e);
  } finally { }
}

//Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/alert-rules/get-alert-rules
async function backupAlertRules() {
  //Create required directories and change permissions if they do not exist.
  //Yes I want this to be synchronous but it does need improvement to handle failure.
  let backupsDir = `${core.coreVars.installedDir}/scripts/backup/alertRulesBackups`;
  if (!fs.existsSync(backupsDir)) {
    console.log(`Creating: ${backupsDir}`);
    core.createDir(backupsDir);
  }
  let returnObj = { "status": "", "message": "", "payload": "" };
  try {
    let targetReports = [];
    //Per documentation its best to define a filter as a queryParams. If not only 50 items will be returned in the array.
    let alertRulesGetObj = {
      "method": "GET",
      "accessId": accessId,
      "accessKey": accessKey,
      "epoch": (new Date).getTime(),
      "resourcePath": "/setting/alert/rules",
      "url": function () {
        return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`
      }
    }
    let alertRulesList = await core.genericAPICall(alertRulesGetObj);
    if (alertRulesList.status == "failure") throw alertRulesList.payload;
    //Lets loop through the response and extract the items that match our filter into a new array.
    for (dle of alertRulesList.payload.data.items) {
      let alertRulesString = JSON.stringify(dle);
      //Convert datasource name to a valid file name.
      let fileName = `alertRules_${dle.name.replace(/\W/g, "_")}.json`
      //Full file path. I really dont need this but...
      let fullStoragePath = `${backupsDir}/${fileName}`;
      fs.writeFile(fullStoragePath, alertRulesString, async (err) => {
        if (err) console.log(`FAILED: ${fileName} : ${err}`);
        console.log(`SAVED: ${fileName}`);
      });
    }
  } catch (e) {
    return core.defaultErrorHandler(e);
  } finally { }
}

//Documentation: https://www.logicmonitor.com/support/rest-api-developers-guide/v1/reports/get-reports
async function backupReports() {
  //Create required directories and change permissions if they do not exist.
  //Yes I want this to be synchronous but it does need improvement to handle failure.
  let backupsDir = `${core.coreVars.installedDir}/scripts/backup/reportsBackups`;
  if (!fs.existsSync(backupsDir)) {
    console.log(`Creating: ${backupsDir}`);
    core.createDir(backupsDir);
  }
  let returnObj = { "status": "", "message": "", "payload": "" };
  try {
    let targetReports = [];
    //Per documentation its best to define a filter as a queryParams. If not only 50 items will be returned in the array.
    let reportsGetObj = {
      "method": "GET",
      "accessId": accessId,
      "accessKey": accessKey,
      "epoch": (new Date).getTime(),
      "resourcePath": "/report/reports",
      "url": function () {
        return `https://${company}.logicmonitor.com/santaba/rest${this.resourcePath}`
      }
    }
    let reportsList = await core.genericAPICall(reportsGetObj);
    if (reportsList.status == "failure") throw reportsList.payload;
    //Lets loop through the response and extract the items that match our filter into a new array.
    for (dle of reportsList.payload.data.items) {
      let reportsString = JSON.stringify(dle);
      //Convert datasource name to a valid file name.
      let fileName = `reports_${dle.name.replace(/\W/g, "_")}.json`
      //Full file path. I really dont need this but...
      let fullStoragePath = `${backupsDir}/${fileName}`;
      fs.writeFile(fullStoragePath, reportsString, async (err) => {
        if (err) console.log(`FAILED: ${fileName} : ${err}`);
        console.log(`SAVED: ${fileName}`);
      });
    }
  } catch (e) {
    return core.defaultErrorHandler(e);
  } finally { }
}

//Launch Pad: Execution Zone
backupDatasources();
backupAlertRules();
backupReports();

//Area 51: Testing Zone

/*
 //Guts of function
 let returnObj = {"status": "","message": "","payload": ""};
 try {
  returnObj.status = "success";
  returnObj.message = "success";
  returnObj.payload = result.payload.data;
  return returnObj;
 } catch (e) {
  return core.defaultErrorHandler(e);
 } finally {}
*/
