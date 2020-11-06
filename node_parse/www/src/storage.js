import { toJS, observable, makeAutoObservable, computed, action } from 'mobx';

class StorageProto {
  constructor() {
     makeAutoObservable(this)
  }

  xml = {};
  availComponents = [];

  @action setXml(data) {
    this.xml = data;
  }

  @action setComponents(data) {
    this.availComponents = data
  }
}

const Storage = new StorageProto();

export default Storage;
