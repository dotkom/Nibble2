
export class ServiceManager{
  constructor(){
    this.services = {};
    this.aliases = {};
  }
  registerService(name,service){
    console.assert(typeof(service) == "function" && typeof(service.constructor) == "function","Service is not a class!")
    this.services[name] = new service(this);
  }
  alias(alias,name){
    this.aliases[alias] = name;
  }
  getService(name){
    const service = this.services[this.aliases[name]] || this.services[name];
    return service;
  }
}


export const serviceManager = new ServiceManager();