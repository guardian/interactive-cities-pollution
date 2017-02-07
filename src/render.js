import mainTemplate from './src/templates/main.html!text'
import Mustache from 'mustache'
import rp from 'request-promise'

export function render() {
    return rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/1or5QZTnVlJqAwd2EOp4gPJWR4s5OgrEKD2A5EuQKoB0.json',
        json: true
    }).then((data) => {
        var html = Mustache.render(mainTemplate, data);
        return html;
    });
}
