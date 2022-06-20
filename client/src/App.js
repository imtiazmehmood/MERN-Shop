import Header from "./Components/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Books, AddBook, UpdateBook, BookDetails } from "./Pages";
function App() {
  return (
    <>
      <Header />
      <Router>
        <Switch>
          <Route path="/" exact>
            <Books />
          </Route>
          <Route path="/addbook" exact>
            <AddBook />
          </Route>
          <Route path="/updatebook" exact>
            <UpdateBook />
          </Route>
          <Route path="/bookdetails" exact>
            <BookDetails />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
