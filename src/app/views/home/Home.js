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
import {getPositions, getUnits, getRates} from '../../services'
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
    units: [],
    positions: [],
    rates: []
  };

  componentDidMount() {
    getPositions().then((positions) => {
       return positions ;//this.setState({positions})
    }).then((positions) => {
       return getUnits().then(units => ({positions, units}))
     // this.setState({units})
    }).then((data) => {
        const {positions, units} = data;
        return getRates().then(rates => ({positions, units, rates}))
    }).then((data) => {
      console.log('RATES',data)
      //this.setState({rates})
    })
  

    this.enterAnimationTimer = setTimeout(this.setViewEnters, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.enterAnimationTimer);
  }

  render() {
    const { animated, viewEnters } = this.state;
    let id = 0;
    function createData(name, calories, fat, carbs, protein) {
      id += 1;
      return { id, name, calories, fat, carbs, protein };
    }
    
    const data = [
      createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
      createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
      createData('Eclair', 262, 16.0, 24, 6.0),
      createData('Cupcake', 305, 3.7, 67, 4.3),
      createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];
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
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell numeric>Calories</TableCell>
                    <TableCell numeric>Fat (g)</TableCell>
                    <TableCell numeric>Carbs (g)</TableCell>
                    <TableCell numeric>Protein (g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(n => {
                    return (
                      <TableRow key={n.id}>
                        <TableCell component="th" scope="row">
                          {n.name}
                        </TableCell>
                        <TableCell numeric>{n.calories}</TableCell>
                        <TableCell numeric>{n.fat}</TableCell>
                        <TableCell numeric>{n.carbs}</TableCell>
                        <TableCell numeric>{n.protein}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
                </CardText>
                <CardActions>
                  <FlatButton
                    label="go previous"
                    onTouchTap={this.goPreviousRoute}
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

  goPreviousRoute = () => {
    const { history } = this.props;
    history.goBack();
  }
}

export default Home;
