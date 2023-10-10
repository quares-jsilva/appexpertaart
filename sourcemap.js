const sourceMap = require('source-map');
const fs = require('fs');

fs.readFile('./android/app/build/index.android.bundle.map', 'utf8', async function (err, data) {

    const whatever = await sourceMap.SourceMapConsumer.with(data, null, consumer => {
        console.log(consumer.sources);

        console.log(
          consumer.originalPositionFor({
            line: 1148,
            column: 4896
          })
        );

        consumer.eachMapping(function(m) {
          // ...
        });

        return computeWhatever();
      });

});