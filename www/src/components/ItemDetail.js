import { Fragment } from 'react';
import { observer } from 'mobx-react';

const ItemDetail = (props) => {
  const { item } = props;

  const submitName = (e) => {
    e.preventDefault();

    const { value } = e.target.parentElement.children[0];

    if (value && value !== '') {
      item.textLabel[0] = value;
    }
  }

  return (
    <Fragment>
      <div>
        <p>name: {item.textLabel[0]}</p>
        <form>
          <input type="text" defaultValue={item.textLabel[0]}></input>
          <button type="button" onClick={(e) => submitName(e)}>update name</button>
        </form>
        <div className="item">
          <p>item variation (texture): {item.textureIndex[0].$.value}</p>
        </div>
      </div>
    </Fragment>
  )
}

export default observer(ItemDetail);
