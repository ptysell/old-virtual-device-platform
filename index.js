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
	this.name = device["name"],
	
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

