// @flow weak

import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import cx                 from 'classnames';
import {
  Card,
  CardActions,
  CardTitle,
  CardText
}                         from 'material-ui/Card';
import FlatButton         from 'material-ui/FlatButton';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// services
import {getAllData} from '../../services'
class Home extends PureComponent {
  static propTypes = {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired
  };

  static contextTypes = {
    // for manual routing
    router: PropTypes.object.isRequired
  };

  enterAnimationTimer = null;

  state = {
    animated: true,
    viewEnters: false,
    positions: []
  };

  componentDidMount() {
    getAllData().then((positions) => {
       this.setState({positions});
    })

    this.enterAnimationTimer = setTimeout(this.setViewEnters, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.enterAnimationTimer);
  }

  render() {
    const { animated, viewEnters } = this.state;
 
    const data = this.state.positions;

    return(
      <section
        id="home__container"
        className={
          cx({
            'content':       true,
            'animatedViews': animated,
            'invisible':     !viewEnters,
            'view-enter':    viewEnters
          })
        }>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="box">
              <Card>
                <CardTitle
                  title="Home"
                  subtitle="View"
                />
                <CardText>
                <Table >
                <TableHead>
                  <TableRow>
                    <TableCell>Financial Unit</TableCell>
                    <TableCell numeric>Notional Value</TableCell>
                    <TableCell numeric>Rate</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell numeric>Calculated Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(n => {
                    return (
                      <TableRow key={n.keyid}>
                        <TableCell component="th" scope="row">
                          {n.name}
                        </TableCell>
                        <TableCell numeric>{n.notionalValue}</TableCell>
                        <TableCell numeric>{n.rate}</TableCell>
                        <TableCell numeric>{n.ccy}</TableCell>
                        <TableCell numeric>{n.calculated}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
                </CardText>
                <CardActions>
                  <FlatButton
                    label="Export To Csv"
                    onTouchTap={this.exportToCsv}
                  />
                </CardActions>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  setViewEnters = () => {
    this.setState({viewEnters: true});
  }

  exportToCsv = () => {
    
    let csvContent = "data:text/csv;charset=utf-8,";
    function ConvertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';

      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
              if (line != '') line += ','

              line += array[i][index];
          }

          str += line + '\r\n';
      }

      return str;
    }

    csvContent += ConvertToCSV(this.state.positions);



    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    link.innerHTML= "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"
  }
}

export default Home;
