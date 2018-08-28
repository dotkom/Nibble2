import React from 'react';

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.tabs = null;
    this.shouldUpdate = true;
  }

  initTabs() {
    if (this.shouldUpdate) {
      $(this.tabs).tabs();
      this.shouldUpdate = false;
    }
  }

  componentDidMount() {
    this.initTabs();
  }

  componentDidUpdate() {
    this.initTabs();
  }

  componentWillReceiveProps(props) {
    const oldKeys = React.Children.map(this.props.children, child => child.key);
    const newKeys = React.Children.map(props.children, child => child.key);
    // If we have more children now than previously we need re-initialize
    // materialize's tabs
    this.shouldUpdate = oldKeys.length > newKeys.length;
    // If not, we have to check if there are any new children by comparing keys
    const keyMap = {};
    if (!this.shouldUpdate) {
      for (let i in oldKeys) {
        keyMap[i] = true;
      }
      for (let i in newKeys) {
        if (!keyMap[i]) {
          this.shouldUpdate = true;
          break;
        }
      }
    }
  }

  setTabRef(tabs) {
    this.tabs = tabs;
  }

  render() {
    let nextId = 1;
    const tabsContent = []
    const tabs = React.Children.map(this.props.children,
      (child) => {
        const id = nextId++;

        tabsContent.push(
          <div className="col s12" key={id} id={`tab-${id}`}>
            {child.props.children}
          </div>,
        );

        return React.cloneElement(child, {
          id: `tab-${id}`,
          children: null,
        });
      }
    );
    return (
      <div className="row">
        <div className="col s12">
          <ul ref={(...a) => this.setTabRef(...a)} className="tabs">
            {tabs}
          </ul>
        </div>
        {tabsContent}
      </div>
    );
  }
}
