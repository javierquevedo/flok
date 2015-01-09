# Flok Activity Component

## Pushing stream events

The events need to be pushed to the backend using post. Once they're parsed into the database they become available to the frontend.

The authorisation is done with API keys. These have to be set up in the config to allow access to posting stream events:

    apiKeys: {
		'oneKeyHashHere': {
			'/activity': ['POST']
		}
	}

## Stream JSON Format

version: 0.0.3

### Stream

	{
		version: "0.0.3"
		events: [],
	}

### Single Entry

    {
		timestamp: "JSON_DATE",
		provider: "STRING",
		sourceId: "STRING"
		link: "URL",
		title: "STRING",
		message: {
			content: "STRING",
			format: "html"
		},
		author: {
			name: "STRING"
		},
		duration: number,
	}

Note:

* Required: timestamp, provider, author, sourceId
  * sourceId: unique id of the provider's item, to avoid import of duplicates
* One of required: title|message
* message.format can be `html`, that's all for now.
* duration should be in __minutes__ as Integers.

## Avatar Images

The module will look for images with the file name `{{author.name}}.png` in the root `public/media/avatar` folder of flok. Simply placing correctly named images in there will make them show up on the stream. A good size would be at least 140px x 140px.
