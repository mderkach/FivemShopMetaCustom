import { Fragment } from 'react';
import ItemDetail from "../components/ItemDetail";
import { observer } from 'mobx-react';

const CompInfo = (props) => {
  const { item, type, xmlCompInfo } = props;

  return (
    <Fragment>
      <div className="item">
        <p>Type: {type}</p>
        {/* <p>Available Textures: {item.numAvailTex[0].$.value}</p>
        <p>Models: {item.aDrawblData3[0].Item.length}</p> */}
        {xmlCompInfo.filter(item => {
          return item.hash_D12F579D[0].$.value == type && item.hash_2FD08CEF[0] !== ''
        }).map((item,index) => (
          <ItemDetail key={index} item={item} />
        ))}
      </div>
    </Fragment>
  )
}

export default observer(CompInfo);
