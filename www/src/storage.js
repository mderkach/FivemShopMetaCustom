import { observable, makeAutoObservable, action } from 'mobx';

class StorageProto {
  constructor() {
     makeAutoObservable(this)
  }

  @observable xml = {};

  @observable processingItem = {};

  @observable processingItemType = '';



  itemXml = {
    lockHash: ['custom'],
    cost: [
      {
        $: {
          value: '0'
        }
      }
    ],
    textLabel: ['CLO_GRF_U_26_0'],
    uniqueNameHash: ['DLC_MP_GR_F_JBIB_26_0'],
    eShopEnum: ['CLO_SHOP_LOW'],
    locate: [
      {
        $: {
          value: '122'
        }
      }
    ],
    scriptSaveData: [
      {
        $: {
          value: '0'
        }
      }
    ],
    restrictionTags: [
      {
        Item: [
          {
            tagNameHash: [
              'DLC_MODEL_NUMBER'
            ]
          },
          {
            tagNameHash: [
              'MODEL_NUMBER'
            ]
          }
        ]
      }
    ],
    forcedComponents: [],
    variantComponents: [
      {
        Item: [
          {
            nameHash: ['DLC_MP_GR_F_SPECIAL_24_0'],
            enumValue: [
              {
                $: {
                  value: '0'
                }
              }
            ],
            eCompType: [
              'PV_COMP_ACCS'
            ]
          },
        ]
      }
    ],
    variantProps: [''],
    drawableIndex: [
      {
        $: {
          value: '0'
        }
      }
    ],
    localDrawableIndex: [
      {
        $: {
          value: 'MODEL_NUMBER'
        }
      }
    ],
    eCompType: ['PV_COMP_[COMPONENT_TYPE]'],
    textureIndex: [
      {
        $: {
          value: 'TEXTURE_INDEX'
        }
      }
    ],
    isInOutfit: [
      {
        $: {
          value: 'false'
        }
      }
    ]
  }

  @action setXml(data) {
    this.xml = data;
  }

  @action createItem(item) {
    this.xml.ShopPedApparel.pedComponents[0].Item.push(item)
  }

  @action setProcessingItem(data) {
    this.processingItem = data;
  }

  @action setProcessingItemType(data) {
    this.processingItemType = data;
  }

  @action filtersComponentsFromStore(data) {
    this.setProcessingItemType(data);
    const components = this.xml.ShopPedApparel.pedComponents[0].Item;
    const targetKey = `PV_COMP_${this.processingItemType.toUpperCase()}`;

    this.setProcessingItem(components.filter(item => item.eCompType[0] === targetKey));
  }
}

const Storage = new StorageProto();

export default Storage;
