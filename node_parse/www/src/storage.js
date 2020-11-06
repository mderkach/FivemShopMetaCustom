import { toJS, observable, computed, action } from 'mobx';

class StorageProto {
  @observable xml = {};
  @observable availComponents = [];
}

const Storage = new StorageProto();

export default Storage;
