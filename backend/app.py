from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import qrcode
import io
import base64

# Crear aplicación Flask
app = Flask(__name__)
CORS(app)  # Permitir todos los orígenes

@app.route('/')
def home():
    return jsonify({'message': '🚀 QR Generator API is running!', 'status': 'active'})

@app.route('/api/health')
def health_check():
    return jsonify({'service': 'QR Generator Backend', 'version': '1.0.0', 'status': 'healthy'})

@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate_qr():
    if request.method == 'OPTIONS':
        # Responder a preflight request
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        print("🎯 RECIBIENDO PETICIÓN POST EN /api/generate")
        
        # Obtener Los dats de Json - VERSION SIMPLIFICCADA
        data = request.json.get('data', '')
        print(f"📦 Datos recibidos: '{data}'")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generar QR - VERSIÓN SIMPLIFICADA
        print("🔄 Generando QR...")
        
        # Método más simple y confiable
        qr = qrcode.make(data)
        
        # Convertir a base64 - FORMA CORRECTA
        buffer = io.BytesIO()
        qr.save(buffer)  # Sin parámetro 'format'
        buffer.seek(0)
        
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        print("✅ QR GENERADO EXITOSAMENTE")
        
        response = jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'data': data
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/download', methods=['GET'])
def download_qr():
    try:
        data = request.args.get('data', '')
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        qr = qrcode.make(data)
        buffer = io.BytesIO()
        qr.save(buffer)
        buffer.seek(0)
        
        response = send_file(buffer, mimetype='image/png', as_attachment=True, download_name='qrcode.png')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except Exception as e:
        response = jsonify({'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

if __name__ == '__main__':
    print('🎯 Starting QR Generator Server...')
    print('📡 Server running on: http://127.0.0.1:5000')
    print('🔗 CORS enabled for all origins')
    app.run(debug=True, host='0.0.0.0', port=5000)