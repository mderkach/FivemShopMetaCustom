import { Fragment } from 'react';
import { observer } from 'mobx-react';

const ItemDetail = (props) => {
  const { item } = props;

  const submitName = (e) => {
    e.preventDefault();

    const { value } = e.target.parentElement.children[0];

    if (value && value !== '') {
      item.hash_2FD08CEF[0] = value;
    }
  }

  return (
    <Fragment>
      <div>
        <p>name: {item.hash_2FD08CEF[0]}</p>
        <form>
          <input type="text" defaultValue={item.hash_2FD08CEF[0]}></input>
          <button type="button" onClick={(e) => submitName(e)}>update name</button>
        </form>
        <div className="item">
          <p>flags: {item.hash_07AE529D[0]}</p>
          <p>item variation (texture): {item.hash_FA1F27BF[0].$.value}</p>
        </div>
      </div>
    </Fragment>
  )
}

export default observer(ItemDetail);
