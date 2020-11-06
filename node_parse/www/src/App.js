import { Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import CompInfo from './components/CompInfo';
import Storage from './storage';

const App = () => {
  const {xml, availComponents} = Storage;
  const [type, setType] = useState();

  const onClick = function () {
    const file = new FormData(document.form)
    axios.post('http://localhost:4000/data', file).then(res => {
      xml = res.data[0]
      availComponents = res.data[1]
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

  if (xml) console.log(xml)
  if (availComponents) console.log(availComponents)

  return (
    <Fragment>
      <form method="POST" name="form" onChange={(e) => onChange(e)}>
        <input type="file" name="file" id="file"></input>
        <input type="button" onClick={onClick} id="post" value="upload"></input>
      </form>
      <div id="res">
        {
          xml && (
            xml.CPedVariationInfo.aComponentData3[0].Item.map((item, index) => (
              <CompInfo key={index} item={item} type={availComponents[index]} xmlCompInfo={xml.CPedVariationInfo.compInfos[0].Item}/>
            ))
          )
        }
      </div>
    </Fragment>
  )
}

export default observer(App);
