# parcel-app

.NET Core 5.0 Templates WebApp with Parcel + TypeScript

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/parcel-app.png)](http://parcel-app.web-templates.io/)

> Browse [source code](https://github.com/NetCoreTemplates/parcel-app), view live demo [parcel-app.web-templates.io](http://parcel-app.web-templates.io) and install with [dotnet-new](https://docs.servicestack.net/dotnet-new):

    $ dotnet tool install -g x

    $ x new parcel-app ProjectName

## About

This project combines the simplicity of developing modern JavaScript Apps with the [parcel template](https://github.com/NetCoreTemplates/parcel) with the simplicity of developing .NET Core Apps with [ServiceStack Sharp Apps](https://sharpscript.net/docs/sharp-apps) to provide a unified solution for creating rich Apps in a live rapid development workflow without compilation allowing the creation of 
[pure Cloud Apps](https://sharpscript.net/docs/sharp-apps#pure-cloud-apps) and [simplified deployments](https://sharpscript.net/docs/deploying-sharp-apps).

## Layout

This template is maintained in the following directory structure:

 - `/app` - Your Web App's published source code and any plugins
 - `/client` - The Parcel managed Client App where client source code is maintained
 - `/server` - Extend your Web App with an optional `server.dll` plugin containing additional Server functionality

Most development will happen within `/client` which is automatically published to `/app` using parcel's CLI that's invoked from the included npm scripts.

### client

The difference with [rockwind-app](https://github.com/NetCoreTemplates/rockwind-app) is that the client source code is maintained in the `/client` folder and uses [Parcel JS](https://parceljs.org) to automatically bundle and publish your App to `/app/wwwroot` which is updated with live changes during development.

The client folder also contains the npm [package.json](https://github.com/NetCoreTemplates/parcel-app/blob/master/client/package.json) which contains all npm scripts required during development.

If this is the first time using Parcel, you will need to install its global CLI:

    $ npm install -g parcel-bundler

Then you can run a watched parcel build of your Web App with:

    $ npm run dev

Parcel is a zero configuration bundler which inspects your `.html` files to automatically transpile and bundle all your **.js** and **.css** assets and other web resources like TypeScript **.ts** source files into a static `.html` website synced at `/app/wwwroot`.

Then to start the ServiceStack Server to host your Web App run:

    $ npm run server

Which will host your App at `http://localhost:5000` which in `debug` mode will enable [hot reloading](https://sharpscript.net/docs/hot-reloading) 
which will automatically reload your web page as it detects any file changes made by parcel.

### server

To enable even richer functionality, this Web Apps template is also pre-configured with a custom Server project where you can extend your Web App with [Plugins](https://sharpscript.net/docs/sharp-apps#plugins) where all `Plugins`, `Services`, `Filters`, etc are automatically wired and made available to your Web App. 

This template includes a simple [ServerPlugin.cs](https://github.com/NetCoreTemplates/parcel-app/blob/master/server/ServerPlugin.cs) which contains an Empty `ServerPlugin` and `Hello` Service:

```csharp
public class ServerPlugin : IPlugin
{
    public void Register(IAppHost appHost)
    {
    }
}

//[Route("/hello/{Name}")] // Handled by /hello/_name.html API page, uncomment to take over
public class Hello : IReturn<HelloResponse>
{
    public string Name { get; set; }
}

public class HelloResponse
{
    public string Result { get; set; }
}

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hi {request.Name} from server.dll" };
    }
}
```

To build the `server.csproj` project and copy the resulting `server.dll` to `/app/plugins/serer.dll` which will require restarting the server to load the latest plugin:

    $ npm run server

This will automatically load any `Plugins`, `Services`, `Filters`, etc and make them available to your Web App. 

One benefit of creating your APIs with C# ServiceStack Services instead of [Sharp APIs](https://sharpscript.net/docs/sharp-apis) is that you can generate TypeScript DTOs with:

    $ npm run dtos

Which saves generate DTOs for all your ServiceStack Services in [dtos.ts](https://github.com/NetCoreTemplates/parcel-app/blob/master/client/dtos.ts) which can then be accessed in your TypeScript source code.

If preferred you can instead develop Server APIs with API Pages, an example is included in [/client/hello/_name.html](https://github.com/NetCoreTemplates/parcel-app/blob/master/client/hello/_name.html)

```html
{{ { result: `Hi ${name} from /hello/_name.html` } |> return }}
```

Which as it uses the same data structure as the `Hello` Service above, can be called with ServiceStack's `JsonServiceClient` and generated TypeScript DTOs.

The [/client/index.ts](https://github.com/NetCoreTemplates/parcel-app/blob/master/client/index.ts) shows an example of this where initially the App calls  the C# `Hello` ServiceStack Service:

```ts
import { client } from "./shared";
import { Hello, HelloResponse } from "./dtos";

const result = document.querySelector("#result")!;

document.querySelector("#Name")!.addEventListener("input", async e => {
  const value = (e.target as HTMLInputElement).value;
  if (value != "") {
    const request = new Hello();
    request.name = value;
    const response = await client.get(request);
    // const response = await client.get<HelloResponse>(`/hello/${request.name}`); //call /hello/_name.html API
    result.innerHTML = response.result;
  } else {
    result.innerHTML = "";
  }
});
```

But while your App is running you can instead toggle the uncommented the line and hit `Ctrl+S` to save `index.ts` which Parcel will automatically transpile and publish to `/app/wwwroot` that will be detected by Hot Reload to automatically reload the page with the latest changes. Now typing in the text field will display the response from calling the `/hello/_name.html` API instead.

### Deployments

During development Parcel maintains a debug and source-code friendly version of your App. Before deploying you can build an optimized production version of your App with:

    $ npm run build

Which will bundle and minify all `.css`, `.js` and `.html` assets and publish to `/app/wwwroot`.

Then to deploy Web Apps you just need to copy the `/app` folder to a server that has 
[.NET Core 5.0](https://dotnet.microsoft.com/download/) and `dotnet tool install -g web` installed which can then be run by running the
`web` global tool in the `/app` folder or by specifying the full path to the `web` tool and `app.settings`, e.g:

    $ $HOME/.dotnet/tools/web /path/to/app/app.settings            # Linux or macOS
    $ %USERPROFILE%\.dotnet\tools\web C:\path\to\app\app.settings  # Windows

Please see [Deploying Web Apps](https://sharpscript.net/docs/deploying-sharp-apps) for a detailed guide on deploying to Linux or Docker.

Alternatively you can bundle the `web` binaries with your App with:

    $ x publish

Which will copy your `/app` and `web` binaries to the `/publish` folder:

    /publish
      /app
      /web

That can then be run by running the `web.dll` directly:

    $ dotnet /path/to/web/web.dll

Which will find your `../app/app.settings` in one of its search paths.

## Learn

See [Deploying Web Apps](https://sharpscript.net/docs/deploying-sharp-apps) for more info.