# News aggregator

This API is built in NestJS framework with Typescript. It allows to search for articles in the New York Time's, The Guardian APIs and NewsAPI. You can search in one of the three providers or in all at same time. For any search a token is required. This token is obtained by signin with a valid user in the database.

## First steps

1. run `npm install`
2. generate database with dump.sql
3. watch .envexample for get a guide of how provide your own NYT,The Guardian and NewsApi API keys, provide your DB credentials and also provide a secret pass for JsonWebToken.
4. run `npm run up`

## Usage

- endpoint for login is /login
- payload for login is {username:string,password:string}
- endpoint for news is /news?q=[search]&source=[provider]
- q query param is the term or setence searched
- source is the provider for search, accepts values: nyt|guardian|news|all

## Environment variables required

|     Variable | Description                             |
| -----------: | :-------------------------------------- |
|   JWT_SECRET | Secret pass used to sign and verify JWT |
|      NYT_KEY | Key for New York Time's API             |
| GUARDIAN_KEY | Key for The Guardian API                |
|     NEWS_KEY | Key for NewsAPI                         |
|      DB_PORT | Port of the PostegreSql database        |
|      DB_HOST | Host of the database                    |
|      DB_USER | User for access database                |
|      DB_PASS | Password for user access                |
|      DB_NAME | Name of the database                    |

## Documentation

More examples of use cases of this API can be founded [here](https://documenter.getpostman.com/view/9673662/SWLZhBT6?version=latest)

# Patterns and antipatterns

## Which patterns does Nest.JS use? Why? How are they implemented?

1. Singleton: this is a main attribute of Nest and is the default scope of any provider in Nest (unless we specify something different), when we define our classes as providers, we can inject this classes, for this we define them as providers in module config, so when we share providers through modules, the instance of the injected class will be the same. Nest do this for optimize the use of resources.

2. Dependecy injection: through this pattern in Nest we can share software code to others units of code. The most common way for do this is decorate a class with @Injectable(), now we can provide this class, through a module, next in services and controller we can inject through the constructor, which is the most common and preferible point in Nest for inject a dependecy

3. Decorator: Nest take advantage of Typescript decorator syntax for enrich class and objects. So in Nest we can use decorator within class declaration, method declaration, property declaration and parameter declaration, by doing this we can add a extra layer of logic or specify more about our code. For example when we use @Module(), we are saying to Nest that our class will be a module.

4. Chain of responsability: Nest provides us with a very util types of middleware like guards, interceptors and pipes. This middlewares and our custom and simple middleware can implement our logic for validate authorization,data for example, when the logic results in a positive result the control will be passed to next middleware in the request flow.

## Which patterns can be used on your application? How those patterns could be implemented?

1. Repository: given that I'm using TypeOrm I can extend the Repository pattern. For achieve that I can create classes that extends `Repository<T>`. Now instead of adding logic related to database handlig to my services, I can define that logic in the repository class.

For example.

```typescript
class ArticleRepository extends Repository<Article> {
  private findArticle(webUrl: string): Promise<Article> {
    return this.findOne({ webUrl: webUrl });
  }
}
```

Why I use this pattern? If I implement this, I can encapsulate the logic related to a specific entity in the database. With that I can achieve more modularity in my API and agilize future testing at reducing coupling of code.

2. Decorator: when I get a valid JWT in ChangePassword method, instead of getting the user as `req.user`, I can implement a parameter decorator for retrieving the user.

```typescript
const LoggedUser = createParamDecorator(
  (data: unknown, req: Request): UserBody => {
    return req.user as UserBody;
  },
);
```

Now I can use that decorator on my method

```typescript
changePassword(@LoggedUser user:User){
    ...
}
```

Why I use this pattern? A decorator allow me to enrich my method parameters. Even add more logic to a defined object like the parameter I use for change the password of a user.

## What is an antipattern?

As patterns, antipatterns are a way to solve or handle a common or well-known problem in software development. The difference with patterns, is that antipatterns have negative consequences as we apply them. For example the famous spaghetti code is an antipattern, this way may works for any code programming but it will cause multiple problems like bad quality software, difficulties for testing, high coupled code and propagation of errors, etc.

## How to implement the Dependency Injection pattern in Typescript?

For example, we can have this DB interface for define a contract about what our databases must behave. Our Database class must implement this interface.

```typescript
interface DB {
  save(content: string): void;
}

class Database implements DB {
  save(content: string) {}
}

class NosqlDatabase implements DB {
  save(content: string) {}
}
```

Now instead of instanciate our database, in our client class we define an object with DB interface type. Next we define the constructor, which has as parameter an object with a valid DB shape.

We can define a valid method who uses that private db object.

```typescript
class Post {
  private db: DB;

  constructor(database: DB) {
    this.db = database;
  }

  savePost(content: string): void {
    this.db.save(content);
  }
}
```

At the time of instanciation we can pass to our client class whatever object which fullfil our contract.

```typescript
const ourDb = new Database();
const ourNosqlDb = new NosqlDatabase();

const sqlPost = new Post(ourDb);
const noSqlPost = new Post(ourNosqlDb);

sqlPost.save('Hello world');
noSqlPost.save('Hello world');
```

By using Dependency injection we decoupled our software entities and gain flexibility for change our dependencies when we need.

Typescript also provide a sugar syntax for implement constructor dependecy injection, and avoid manual instanciation.

```typescript
class Post {
  constructor(private readonly db: DataBase) {}
}
```

# Removed antipatterns

1. Blob: one example on this antipattern in my API was the users service. In the first versions of this service I have a multiple functions more or less related with the logic behind users persistance. The file reached more than 100 lines of code. I think was an obvious antipattern for the size of the file, the coupled logic.

2. Functional decomposition: in files related to authentication logic there was file with classes with function names that does not extend the OOP principles and does not have relations of OO kind.
