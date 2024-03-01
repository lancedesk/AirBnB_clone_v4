#!/usr/bin/python3
""" Starts a Flash Web Application """
from flask import Flask, render_template, url_for
from models import storage
import uuid
app = Flask(__name__)
app.url_map.strict_slashes = False


@app.teardown_appcontext
def teardown_db(exception):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb')
def hbnb_filters(the_id=None):
    """ HBNB is alive! """
    state_objs = storage.all('State').values()
    states = dict([state.name, state] for state in state_objs)
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()

    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())

    cache_id = uuid.uuid4()

    return render_template('4-hbnb.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users,
                           cache_id=cache_id)


if __name__ == "__main__":
    """MAIN Function"""
    app.run(host='0.0.0.0', port=5000, debug=True)
