import { Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS, autorun } from 'mobx'
import axios from 'axios';
import CompInfo from './components/CompInfo';
import Storage from './storage';
import { Grid, Box, CssBaseline, Button, ListItem, List, ListItemText, ListItemIcon, Divider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import Head from './icons/head.svg';
import Mask from './icons/mask.svg';
import Hair from './icons/hair.svg';
import Arms from './icons/arms.svg';
import Pants from './icons/pants.svg';
import Bag from './icons/bag.svg';
import Shoes from './icons/shoes.svg';
import Scarf from './icons/scarf.svg';
import Tshirt from './icons/tshirt.svg';
import Armor from './icons/armor.svg';
import Decl from './icons/decl.svg';
import Jacket from './icons/jacket.svg';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const componentsDict = {
  0: ['head', <Head />],
  1: ['berd', <Mask />],
  2: ['hair', <Hair />],
  3: ['uppr', <Arms />],
  4: ['lowr', <Pants />],
  5: ['hand', <Bag />],
  6: ['feet', <Shoes />],
  7: ['teef', <Scarf />],
  8: ['accs', <Tshirt />],
  9: ['task', <Armor />],
  10: ['decl', <Decl />],
  11: ['jbib', <Jacket />],
}

const App = () => {
  const [pedType, setPedType] = useState();
  const [processingItem, setProcessingItem] = useState()
  const [processingItemType, setProcessingItemType] = useState()

  const onFormChange = function (e) {
    const path = e.target.value;

    const targetPath = path.substring(
      path.lastIndexOf("\\") + 1,
      path.indexOf(".")
    );

    setPedType(targetPath)

    const file = new FormData(document.form)
    console.log(document.form.file.files.length)
    if (document.form.file.files.length) {
      axios
        .post('http://localhost:4000/data', file).then(res => {
          Storage.setXml(res.data)
          console.log(res.data)
        })
        .catch(err => console.log(err))
    }
  }

  const postCustomXml = (data) => {
    axios
      .post('http://localhost:4000/generate', {
        fileData: data,
        fileName: pedType
      })
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  const filterComponents = (key) => {
    const components = jsDataXml.ShopPedApparel.pedComponents[0].Item;
    const targetKey = `PV_COMP_${key.toUpperCase()}`

    setProcessingItem(components.filter(item => item.eCompType[0] === targetKey));
    setProcessingItemType(key);
  }

  const jsDataXml = toJS(Storage.xml);

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box m={1}>
          <Grid container spacing={1}>
            <Grid item xs={2}>

              <form method="POST" name="form" onChange={(e) => onFormChange(e)}>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept="text"
                  style={{ display: 'none'}}
                />
                <label htmlFor="file">
                  <Button variant="contained" color="primary" component="span">
                    <DescriptionIcon /> Upload XML
                  </Button>
                </label>
              </form>
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" alignItems="center" m={1}>
                {pedType && (<span>TargetPed: {pedType}</span>)}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box display="flex" alignItems="center" m={1}>
                {processingItemType && (<span>TargetComponent: {processingItemType}</span>)}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" component="span" onClick={() => postCustomXml(jsDataXml)}>
                <SaveAltIcon /> Create new XML
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box m={1}>
          <Grid container spacing={1}>
            <Grid item xs>
              <List>
                {Object.keys(jsDataXml).length !== 0 && jsDataXml && Object.values(componentsDict).map(component => (
                  <ListItem button key={component} onClick={(e) => {filterComponents(component[0])}}>
                    <ListItemIcon>{component[1]}</ListItemIcon>
                    <ListItemText primary={component[0]} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={10} style={{ overflow: 'hidden', height: 'calc(100vh - 80px)'}}>
              {
                Object.keys(jsDataXml).length !== 0 && jsDataXml && processingItemType && processingItem && (
                  <CompInfo
                    type={processingItemType}
                    xmlCompInfo={processingItem}
                  />
                )
              }
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </Fragment>
  )
}

autorun(() => {
  toJS(Storage.xml)
  toJS(Storage.availComponents)
})

export default observer(App);
