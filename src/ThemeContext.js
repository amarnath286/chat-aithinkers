import React from 'react';

const themeColours = {
  light: {
    color: '#000000',
    backgroundColor: '#F5F6F6',
    pinnedColor: '#EBEBEB',
    greenColor: '#2FC058',
    borderColor: '#CED4DA',
    msgBgm: '#F5F6F6',
    inputWhite: '#FFF',
    menuIcon: '#CED4DA',
    iconBgm: '#BFC1C3',
    logoTextColor: '#000',
    inputBgm: '#fff',
    // timeColor: '#BFC1C3',
    timeColor: '#000',
    time: '#BFC1C3',
    lightBorder: '#CED4DA',
    chatHeaderText: '#000',
    newGreen: '#000',
    modelBorder: '#EAEAEA',
    modelChat: '#EBEBEB',
    swicthBtn: '#00000040',
    stokeColor: '#0000007a',
    borderPinned: '#CED4DA',
    pinnedShadow: 'none',
    pinnedBgm: '#EBEBEB',
    editBgm: '#FFF',
    // #21272C
  },
  dark: {
    color: '#D8D8D8',
    // backgroundColor: "#252E38",
    backgroundColor: '#2B343D',
    pinnedColor: '#46515C',
    greenColor: '#2FC058',
    borderColor: '#46515C',
    msgBgm: '#46515C',
    inputWhite: '#46515C',
    menuIcon: '#D8D8D8',
    iconBgm: '#46515C',
    logoTextColor: '#BFC1C3',
    // inputBgm: '#2B343D',
    inputBgm: '#21272C',
    time: '#BFBFBF',
    // timeColor: '#D8D8D8',
    timeColor: '#FFF',
    lightBorder: 'none',
    chatHeaderText: '#BFBFBF',
    newGreen: '#2FC058',
    modelBorder: '#707070',
    modelChat: '#252E38',
    swicthBtn: '#2FC058',
    stokeColor: '#d8d8d8',
    borderPinned: '#21272c',
    pinnedShadow: '0px 3px 6px #00000029',
    pinnedBgm: '#2b343d',
    editBgm: '#2B343D',
  },
};

const ThemeContext = React.createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = React.useState('light');

  // React.useEffect(() => {
  //   const darkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   setTheme(darkOS ? 'dark' : 'light');
  // }, []);

  const setTheme = (name) => {
    document.body.style.setProperty('--color', themeColours[name].color);
    document.body.style.setProperty('--msgbgm', themeColours[name].msgBgm);
    document.body.style.setProperty('--iconbgm', themeColours[name].iconBgm);
    document.body.style.setProperty('--inputbgm', themeColours[name].inputBgm);
    document.body.style.setProperty('--newgreen', themeColours[name].newGreen);
    document.body.style.setProperty('--editbgm', themeColours[name].editBgm);
    document.body.style.setProperty(
      '--pinnedbgm',
      themeColours[name].pinnedBgm,
    );
    document.body.style.setProperty(
      '--swicthbtn',
      themeColours[name].swicthBtn,
    );
    document.body.style.setProperty(
      '--pinnedShadow',
      themeColours[name].pinnedShadow,
    );
    document.body.style.setProperty(
      '--borderpinned',
      themeColours[name].borderPinned,
    );
    document.body.style.setProperty(
      '--stokecolor',
      themeColours[name].stokeColor,
    );
    document.body.style.setProperty(
      '--modelchat',
      themeColours[name].modelChat,
    );
    document.body.style.setProperty(
      '--modelborder',
      themeColours[name].modelBorder,
    );
    document.body.style.setProperty(
      '--chatHeaderText',
      themeColours[name].chatHeaderText,
    );
    document.body.style.setProperty(
      '--lightborder',
      themeColours[name].lightBorder,
    );
    document.body.style.setProperty(
      '--timecolor',
      themeColours[name].timeColor,
    );
    document.body.style.setProperty(
      '--logotextcolor',
      themeColours[name].logoTextColor,
    );
    document.body.style.setProperty(
      '--bordercolor',
      themeColours[name].borderColor,
    );
    document.body.style.setProperty(
      '--inputwhite',
      themeColours[name].inputWhite,
    );
    document.body.style.setProperty('--menuicon', themeColours[name].menuIcon);
    document.body.style.setProperty(
      '--greencolor',
      themeColours[name].greenColor,
    );
    document.body.style.setProperty(
      '--pinnedcolor',
      themeColours[name].pinnedColor,
    );
    document.body.style.setProperty(
      '--background-color',
      themeColours[name].backgroundColor,
    );
    setThemeName(name);
  };
  return (
    <ThemeContext.Provider value={{ themeName, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
