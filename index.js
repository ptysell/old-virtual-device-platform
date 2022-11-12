"use strict";

var Service, Characteristic, HomebridgeAPI;
const { HomebridgeVDPVersion } = require('./package.json');

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerPlatform("homebridge-virtual-device-platform", "VirturalDevicePlatform", VirturalDevicePlatform);

}

function VirturalDevicePlatform(log, config){
	this.log = log;
  this.name = config.name;
  this.devices = config["devices"];
  
}

VirturalDevicePlatform.prototype = {
	accessories: function(callback){
		var foundAccessories = [];
		var index = 0;
		var count = this.devices.length;
		
		var accessorygroup  = new VirturalDeviceAccessoryGroup(
				this.log, 
				this.name);
		
		foundAccessories.push(accessorygroup);
		for(index=0; index< count; ++index){
			var accessory  = new VirturalDeviceAccessory(
				this.log, 
				this.devices[index]);
			var accessoryaction  = new VirturalDeviceAccessoryAction(
				this.log, 
				this.devices[index].name, accessory);
			
			foundAccessories.push(accessory);
			foundAccessories.push(accessoryaction);
		}
		
		callback(foundAccessories);
	}
};










//---------------------------------------------------------------------------------------

//VIRTURAL DEVICE ACCESSORY

//---------------------------------------------------------------------------------------



function VirturalDeviceAccessory(log, device) {
	this.log = log;
	this.name = device["name"];
	
	console.log(this.name + " = " + "Test");
	
	 this._service = new Service.Lightbulb(this.name);
      
  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessory_' + this.name.replace(/\s/g, '_'));
  
  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});	
	
	
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));
	
  var cachedState = this.storage.getItemSync(this.name);
  if((cachedState === undefined) || (cachedState === false)) {
    this._service.setCharacteristic(Characteristic.On, false);
    } 
  else {
    this._service.setCharacteristic(Characteristic.On, true);
    }
	
}

VirturalDeviceAccessory.prototype.getServices = function() {
	
  return [this.informationService, this._service];
	
}

VirturalDeviceAccessory.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory] : " + this.name.replace(/\s/g, '_') + " to " + on);
  this.storage.setItemSync(this.name, on);
  callback();
	
}










//---------------------------------------------------------------------------------------

//VIRTURAL DEVICE ACCESSORY ACTION

//---------------------------------------------------------------------------------------


function VirturalDeviceAccessoryAction(log, name, accessory) {
	
  this.log = log;
  this.name = name + " Accessory Action";
  this._service = new Service.Switch(this.name);
  this._state = false;
  
  this.accessory = accessory;
  
  this.log("TEST REGISTRATION ACCESSORY ACTION PARENT : " + this.accessory.name);
    
  
  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory Action')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessoryAction_' + this.name.replace(/\s/g, '_'));
  
  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});	
	
	
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));
	
  var cachedState = this.storage.getItemSync(this.name);
  if((cachedState === undefined) || (cachedState === false)) {
    this._service.setCharacteristic(Characteristic.On, false);
    } 
  else {
    this._service.setCharacteristic(Characteristic.On, true);
    }
	
}

VirturalDeviceAccessoryAction.prototype.getServices = function() {
	
  return [this.informationService, this._service];
	
}

VirturalDeviceAccessoryAction.prototype._setOn = function(on, callback) {

  if (on && this._state){
    this.log("Setting [Accessory Action] : " + this.name.replace(/\s/g, '_') + " from " + on + " to " + !on);
    setTimeout(() => {
      this._service.setCharacteristic(Characteristic.On, false),
      this.accessory.setCharacteristic(Characteristic.On, false)  
      }, 100);
    } 
  else {
    this._state = on;
    
	      this.log("Setting [Accessory Action] : " + this.name.replace(/\s/g, '_') + " from " + on + " to " + !on);
    this.storage.setItemSync(this.name, on);
    }
	
  callback();
	
}

VirturalDeviceAccessoryAction.prototype.getStringFromState = function (state) {
  return state ? 'on' : 'off'
}











//---------------------------------------------------------------------------------------

//VIRTURAL DEVICE ACCESSORY GROUP

//---------------------------------------------------------------------------------------


function VirturalDeviceAccessoryGroup(log, name) {
	
  this.log = log;
  this.name = name + 'Accessory Group';
 
   this._service = new Service.Switch(this.name);
      
  this.informationService = new Service.AccessoryInformation();
  this.informationService
      .setCharacteristic(Characteristic.Manufacturer, 'Virtual Device Platform')
      .setCharacteristic(Characteristic.Model, 'Accessory Group')
      .setCharacteristic(Characteristic.FirmwareRevision, HomebridgeVDPVersion)
      .setCharacteristic(Characteristic.SerialNumber, 'VDPAccessoryGroup_' + this.name.replace(/\s/g, '_'));
  
  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});	
	
	
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));
	
  var cachedState = this.storage.getItemSync(this.name);
  if((cachedState === undefined) || (cachedState === false)) {
    this._service.setCharacteristic(Characteristic.On, false);
    } 
  else {
    this._service.setCharacteristic(Characteristic.On, true);
    }
	
}

VirturalDeviceAccessoryGroup.prototype.getServices = function() {
	
  return [this.informationService, this._service];
	
}

VirturalDeviceAccessoryGroup.prototype._setOn = function(on, callback) {

  this.log("Setting [Accessory Group] : " + this.name.replace(/\s/g, '_') + " to " + on);
  this.storage.setItemSync(this.name, on);
  callback();
	
}
