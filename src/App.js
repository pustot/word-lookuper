import "purecss/build/pure.css";
import React, { useState, useEffect } from "react";
import "./styles.scss";
import { 
  Button, Container, CssBaseline, FormControl, 
  Grid, Icon, IconButton, Input, InputLabel, MenuItem, Select, Stack, Typography,
  TextField, ToggleButton, ToggleButtonGroup 
} from '@mui/material';

import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const [lang, setLang] = React.useState('en');
  const [sentence, setSentence] = React.useState("test");
  const [details, setDetails] = React.useState('');
  const [resultLang, setResultLang] = React.useState('en');

  const handleLangChange = (event) => {
    setLang(event.target.value);
  };

  const getLocaleText = (i18nText, language) => {
    return language in i18nText? i18nText[language] : i18nText["en"];
  };

  // const get = require('got')
  // const URL = require('url')
  // const flat = require('flat')
  // const {get: getProp} = require('lodash')
  // const cheerio = require('cheerio')

  const sendLookUp = async () => {

    // setDetails(dtls);  
    // `https://${locale}.wiktionary.org/w/api.php?origin=*&action=query&prop=extracts&titles=${sentence}&format=json`
    const url = `https://${resultLang}.wiktionary.org/w/api.php?origin=*&action=parse&prop=text&formatversion=2&page=` + sentence;
  
    let resp = await fetch(url, {
        method: "GET"
      });
    // const key = Object.keys(flat(body)).find(key => key.endsWith('.extract'))
    // if (!key) return null // 404 word not found
    // const html = getProp(body, key)
    // const text = cheerio.load(html).text()
    //   .trim() // remove extra whitespace and newlines
    //   .replace('English\n', '')
    //   .replace('Noun\n', '')
    //   .replace('Etymology\n', 'Etymology: ')
    //   .replace('Translation\n', 'Translation: ')
    //   .replace('Anagrams\n', 'Anagrams: ')
    //   .replace(/\n+/gm, '\n') // duplicate newlines
    //   .replace(/\n/gm, '; ')

    if (resp.ok) {
      const parser = new DOMParser();
      let text = await resp.text();
      if (text != undefined) {
        // console.log(text)
        try {
          text = text.replace(/\\&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        } catch (TypeError) {
          text = '';
        }
        let doc = parser.parseFromString(text, 'text/html');
        
        // let selected = doc.querySelector("#mw-content-text > div:nth-child(2) > div > pre > span:nth-child(16) > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > span.IPA");

        if (text.indexOf('mw-toc-heading') != -1) {
          let engstarter = '</h2>';
          let engind = text.indexOf(engstarter);
          text = text.slice(engind + engstarter.length);
        }
        let engind = text.indexOf('<h2>');
        text = text.slice(engind);
        // let ender = '<hr';
        // let nextind = text.indexOf(ender);
        // if (nextind != -1)
        //   text = text.slice(0, nextind);

        // How to convert HTML Entity Number to symbols?
        text = text.replaceAll('\\n', '')
        text = text.replace(/&amp;#32;/g, ' ');
        var tmpElement = document.createElement('span');
        tmpElement.innerHTML = text;
        text = tmpElement.innerHTML;

        setDetails(text);

        console.log(text)
      }
    }
  }

  const handleClickLookUp = async () => {
    sendLookUp();
  }

  const handleChangeResultLang = async (
    event,
    newResultLang,
  ) => {
    // Enforce value set
    if (newResultLang !== null) {
    setResultLang(newResultLang);
    }
  };

  // call look up function after resultLang successfully changed
  useEffect(() => {
    sendLookUp();
  }, [resultLang]);

  const domain = "http://yangcx.tk/";

  return (
    <div>
      
      <Container maxWidth="sm">
      <Stack spacing={4} px={2} pb={4}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{p: 3}}>
          <Button variant="outlined" 
                onClick={colorMode.toggleColorMode}
                color="inherit"
                sx={{textTransform: "none"}}
                startIcon={theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}>
            {getLocaleText(
              {"en": "Theme", "zh-tra": "主題", "zh-sim": "主题", "tto-bro": "Tvo2D8ae", "tto": "VvaH"}, 
              lang
              )}
          </Button>

          <FormControl >
            <InputLabel id="demo-simple-select-label">{getLocaleText(
              {"en": "Language", "zh-tra": "語言", "zh-sim": "语言", "tto-bro": "Zei2ZeiH", "tto": "SRHM"}, 
              lang
              )}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={lang}
              label="Language"
              onChange={handleLangChange}
            >
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"zh-tra"}>繁體中文</MenuItem>
              <MenuItem value={"zh-sim"}>简体中文</MenuItem>
              <MenuItem value={"tto-bro"}>b8Q7Z2D.</MenuItem>
              <MenuItem value={"tto"}>mim</MenuItem>
            </Select>
          </FormControl>

        </Stack>

        <Typography>
            Get simple representation of meaning from Wiktionary.
        </Typography>


            <TextField defaultValue="test" id="input" onChange={(v) => setSentence(v.target.value)}
              multiline
              minRows={2} 
              maxRows={Infinity} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <ToggleButtonGroup
                color="primary"
                value={resultLang}
                exclusive
                onChange={handleChangeResultLang}
                aria-label="ResultLang"
              >
                <ToggleButton value="en">En</ToggleButton>
                <ToggleButton value="zh">漢</ToggleButton>
                <ToggleButton value="ja">日</ToggleButton>
                <ToggleButton value="de">De</ToggleButton>
                <ToggleButton value="fr">Fr</ToggleButton>
              </ToggleButtonGroup>
              <Button variant="outlined" onClick={() => handleClickLookUp()} sx={{width: "auto"}}>Lookup</Button>
            </Stack>

            <div dangerouslySetInnerHTML={{__html: details}} />

      </Stack>
      </Container>
    </div>
  );
}

export default function AppWithColorToggler() {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}