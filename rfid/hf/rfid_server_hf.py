from flask import Flask, jsonify
from flask_cors import CORS
from smartcard.System import readers
from smartcard.Exceptions import NoCardException
import threading
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

rfid_state = {
    "uid": None,
    "timestamp": None,
    "status": "waiting",
    "reader_connected": False
}

def rfid_loop():
    global rfid_state

    while True:
        try:
            r = readers()
            if len(r) == 0:
                rfid_state["reader_connected"] = False
                rfid_state["status"] = "no_reader"
                time.sleep(2)
                continue

            reader = r[0]
            rfid_state["reader_connected"] = True
            connection = reader.createConnection()
            last_uid = None

            while True:
                try:
                    connection.connect()
                    get_uid = [0xFF, 0xCA, 0x00, 0x00, 0x00]
                    data, sw1, sw2 = connection.transmit(get_uid)

                    if sw1 == 0x90 and sw2 == 0x00:
                        uid = ''.join(format(x, '02X') for x in data)

                        if uid != last_uid:
                            rfid_state["uid"] = uid
                            rfid_state["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            rfid_state["status"] = "detected"
                            last_uid = uid

                    time.sleep(0.5)

                except NoCardException:
                    if last_uid is not None:
                        rfid_state["status"] = "removed"
                        rfid_state["uid"] = None
                        last_uid = None
                    time.sleep(0.5)

        except Exception as e:
            rfid_state["status"] = "error"
            rfid_state["reader_connected"] = False
            time.sleep(3)


@app.route('/api/rfid/status', methods=['GET'])
def get_status():
    return jsonify(rfid_state)

@app.route('/api/rfid/reset', methods=['POST'])
def reset():
    rfid_state["status"] = "waiting"
    rfid_state["uid"] = None
    rfid_state["timestamp"] = None
    return jsonify({"message": "reset ok"})


if __name__ == '__main__':
    t = threading.Thread(target=rfid_loop, daemon=True)
    t.start()
    print("HF RFID Server berjalan di http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)

    #tes