// init
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Header, Results } from './components';
import { getArchive } from 'actions/tripActions';
import { useSelector } from 'react-redux';

// make Styles
const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(3) },
  results: { marginTop: theme.spacing(3) }
}));

// trip archive component
const TripArchived = () => {
  const classes = useStyles();
  const { user } = useSelector(state => state.session);
  const [ArchiveList, setArchiveList] = useState([]); ////archived trip list

  useEffect(() => {
    let mounted = true;
    // fetching archive trips from db ans setting state
    const fetchAllTrip = () => {
      getArchive(user._id).then(({ data }) => {
        if (mounted) {
          setArchiveList(data.data);
        }
      });
    };

    fetchAllTrip();
    return () => (mounted = false);
  }, []);

  const handleFilter = () => {};
  const handleSearch = e => {};

  //returning jsx
  return (
    <Page className={classes.root} title="All trip">
      <Header compName="archived" />
      {/* <SearchBar onFilter={handleFilter} onSearch={handleSearch} /> */}
      {ArchiveList && (
        <Results
          className={classes.results}
          triplist={ArchiveList}
          compName="archived"
        />
      )}
    </Page>
  );
};

// exporting component
export default TripArchived;
