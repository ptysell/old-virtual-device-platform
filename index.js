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
		
		for(index=0; index< count; ++index){
			var accessory  = new VirturalDeviceAccessory(
				this.log, 
				this.devices[index]);
			
			foundAccessories.push(accessory);
		}
		
		callback(foundAccessories);
	}
};

function VirturalDeviceAccessory(log, device) {
	this.log = log;
	this.name = device["name"];
	
	this.accessoryaction = new VirturalDeviceAccessoryAction(this.log, this.name);
	
	console.log(this.name + " = " + "Test");
	
	this.services = [];
	
	this.informationService = new Service.AccessoryInformation();

	this.informationService
		.setCharacteristic(Characteristic.Manufacturer, "Virtural Device Platform")
		.setCharacteristic(Characteristic.Model, "Accessory")
		.setCharacteristic(Characteristic.SerialNumber, "AA098BB09");
		
		this.services.push(this.informationService);
  

		this.lightService = new Service.Lightbulb(this.name);
		
		this.lightService
			.getCharacteristic(Characteristic.On)
			.on('set', this.setState.bind(this));
			
		this.services.push(this.lightService);

}

VirturalDeviceAccessory.prototype.setState = function(state, callback) {
	this.log.info("Get State Funciton");
	
}

VirturalDeviceAccessory.prototype.processEventData = function(e){
	this.log.info("Process Event Data Function");	
}

VirturalDeviceAccessory.prototype.getDefaultValue = function(callback) {
	this.log.info("Get Default Value Function");
	callback(null, this.value);
}

VirturalDeviceAccessory.prototype.setCurrentValue = function(value, callback) {
	this.log.info("Set Current Value Function");
}

VirturalDeviceAccessory.prototype.getServices = function() {
	this.log.info("Get Services Function");
	return this.services;
}





function VirturalDeviceAccessoryAction(log, name) {
	
  this.log = log;
  this.name = name = " Accessory Action";
  this._service = new Service.Switch(this.name);
  this._state = false;
    
  
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
      this._service.setCharacteristic(Characteristic.On, false)  
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

