# AdvancedNodeStarter
Mongo DB creates an index on ID for every collection, so when we do a search for a document in the collection, and that search is made using ID, the search gets really fast using that Index.

But if we want to make a search using title for e.x., then the search has to be done in every document in that collection(which is the default behaviour of MongoDB for non Indexed fields), to find which document(s) satisfy the rule of our search. That makes the query ultra expensive.

Two solutions:
1) Add indexes for every element we search in that collection. This is not so good solution because adding indexes slows down the write speed to DB.
2) Add a Cache Server which will check if that query has been executed. If no, query to MongoDB will be done and then the results of that query will be saved to Cache Server. If yes, results from cache server will be returned to application, without querying the Database.

We will go with solution 2, Adding a Redis cache server is the proper solution to the problem.