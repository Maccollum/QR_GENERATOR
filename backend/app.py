from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import qrcode
import io
import base64

# Crear aplicación Flask
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': '🚀 QR Generator API is running!', 'status': 'active'})

@app.route('/api/health')
def health_check():
    return jsonify({'service': 'QR Generator Backend', 'version': '1.0.0', 'status': 'healthy'})

@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate_qr():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        data = request.json.get('data', '')

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # 🔥 QR DE ALTA CALIDAD (FIX REAL)
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=12,
            border=4,
        )

        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # Convertir a base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        img_base64 = base64.b64encode(buffer.getvalue()).decode()

        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'data': data
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/download', methods=['GET'])
def download_qr():
    try:
        data = request.args.get('data', '')

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # 🔥 MISMA CALIDAD PARA DESCARGA
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=12,
            border=4,
        )

        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        return send_file(buffer, mimetype='image/png', as_attachment=True, download_name='qrcode.png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)