import { Fragment, useState } from React;
import { useLocalStore, useObserver } from 'mobx-react';


const ItemDetail = (props) => {
  const { item } = props;

  const submitName = (e) => {
    e.preventDefault();

    const { value } = e.target.parentElement.children[0];

    if (value && value !== '') {
      item.hash_2FD08CEF[0] = value;
      console.log(item.hash_2FD08CEF[0])
    }
  }

  return (
    <Fragment>
      <div>
        <p>name: {item.hash_2FD08CEF[0]}</p>
        <form>
          <input type="text"></input>
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

const App = () => {
  const [state, updateState] = useState();
  const [type, setType] = useState();

  const [customItems, setCustomItems] = useState({
    head: [],
    berd: [],
    hair: [],
    uppr: [],
    lowr: [],
    hand: [],
    feet: [],
    teef: [],
    accs: [],
    task: [],
    decl: [],
    jbib: [],
  })

  const onClick = function () {
    const file = new FormData(document.form)
    axios.post('/data', file).then(res => {
      updateState(res.data)
      console.log(res.data)
    }).catch(err => console.log(err))
  }

  const onChange = function (e) {
    const path = e.target.value;

    const targetPath = path.substring(
      path.lastIndexOf("\\") + 1,
      path.indexOf(".")
    );

    setType(targetPath)
  }

  const fetchData = (index) => {
    if (state[1].indexOf(index)) {
      const target = {
        element: state[1][index],
        path: type
      }

      axios.post('/custom', target)
        .then(res => {
          const { data } = res;
          setCustomItems((items) => {
            const copy = { ...items }
            copy[target.element] = data;
            return copy
          })
        })
    }
    console.log(customItems)
  }

  if (state) console.log(state[1])
  if (state) console.log(state[0])

  return (
    <Fragment>
      <form method="POST" name="form" onChange={(e) => onChange(e)}>
        <input type="file" name="file" id="file"></input>
        <input type="button" onClick={onClick} id="post" value="upload"></input>
      </form>
      <div id="res">
        {
          state && (
            state[0].CPedVariationInfo.aComponentData3[0].Item.map((item, index) => (
              <CompInfo key={index} item={item} type={state[1][index]} xmlCompInfo={state[0].CPedVariationInfo.compInfos[0].Item}/>
            ))
          )
        }
      </div>
    </Fragment>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
