import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import './Home.css'

function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

    const handleSidebarHoverChange = (open: boolean) => {
        setIsSidebarOpen(open)
    }

    const connectLocalCamera = async () => {
        if (isConnecting || isConnected) return
        setIsConnecting(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            setMediaStream(stream)
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play()
            }
            setIsConnected(true)
        } catch (e) {
            setIsConnected(false)
        } finally {
            setIsConnecting(false)
        }
    }

    const disconnectCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((t) => t.stop())
            setMediaStream(null)
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setIsConnected(false)
        setIsConnecting(false)
    }

    useEffect(() => {
        return () => {
            if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop())
        }
    }, [mediaStream])

    return (
        <div className={`home-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Sidebar activePage="home" isOpen={isSidebarOpen} onHoverChange={handleSidebarHoverChange} />

            <div className="home-main">
                <div className="home-content">
                    {/* Header */}
                    <div className="home-header">
                        <span className="home-title">Hệ thống giám sát nhận diện khuôn mặt</span>
                        <div className="home-actions">
                            {!isConnected ? (
                                <button className="btn-register-face" onClick={connectLocalCamera} disabled={isConnecting}>
                                    {isConnecting ? 'Đang kết nối...' : 'Kết nối camera'}
                                </button>
                            ) : (
                                <button className="btn-register-face" onClick={disconnectCamera}>
                                    Ngắt kết nối
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="home-grid">
                        {/* Camera Section */}
                        <div className="camera-section">
                            <div className="section-header">
                                <h2 className="section-title">Camera giám sát</h2>
                                <span className="camera-badge">Cam-1</span>
                            </div>

                            <div className="camera-feed">
                                {!isConnected ? (
                                    <div className="camera-placeholder">
                                        <div className="camera-icon">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M23 7l-7 5 7 5V7z" />
                                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                            </svg>
                                        </div>
                                        <p className="camera-status">{isConnecting ? 'Đang kết nối...' : 'Chưa kết nối camera'}</p>
                                        <p className="camera-hint">Kết nối camera để bắt đầu giám sát</p>
                                    </div>
                                ) : (
                                    <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
                                )}
                            </div>
                        </div>

                        {/* Face Events Panel */}
                        <div className="face-events-section">
                            <div className="section-header">
                                <h2 className="section-title">Sự kiện nhận diện</h2>
                                <span className="events-count">0</span>
                            </div>

                            <div className="face-events-list">
                                <div className="events-empty-state">
                                    <div className="empty-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                                        </svg>
                                    </div>
                                    <p className="empty-status">Chưa kết nối dữ liệu</p>
                                    <p className="empty-hint">Kết nối hệ thống camera để nhận sự kiện nhận diện</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

