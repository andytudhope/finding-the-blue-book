# Subgraph

I'm still working on this given that I didn't set it up initially and so am struggling to structure the deployment files correctly.

However, the query should look something like this:

```graphql
query MyQuery {
  guardianNFTs {
    id
    guardian {
      id
    }
    uri
    createdAtTimestamp
  }
}
```

