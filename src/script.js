import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
// import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI( {width: 360} )

const mediaQueryListDesktop = window.matchMedia("(min-width: 426px)")
const mediaQueryListMobile = window.matchMedia("(max-width: 425px)")

if (mediaQueryListDesktop.matches) {

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    // axeshelper
    // const axesHelper = new THREE.AxesHelper( 3 );
    // scene.add( axesHelper );

    /**
     *  Textures
     */
    const textureLoader = new THREE.TextureLoader()

    //planet 1
    const p1AmbientOcclusionTexture = textureLoader.load('assets/p1_ao.webp')
    const p1MetalnessTexture = textureLoader.load('assets/p1_metallic.webp')
    const p1NormalTexture = textureLoader.load('assets/p1_normal.webp')
    const p1RoughnessTexture = textureLoader.load('assets/p1_roughness.webp')
    const p1AlbedoTexture = textureLoader.load('assets/p1_albedo.webp')
    //planet 2
    const p2AmbientOcclusionTexture = textureLoader.load('/assets/p2_ao.webp')
    const p2MetalnessTexture = textureLoader.load('/assets/p2_metallic.webp')
    const p2NormalTexture = textureLoader.load('/assets/p2_normal.webp')
    const p2RoughnessTexture = textureLoader.load('/assets/p2_roughness.webp')
    const p2AlbedoTexture = textureLoader.load('/assets/p2_albedo.webp')
    const p2EmissiveTexture = textureLoader.load('/assets/p2_emissive.webp')
    //planet 3
    const p3AmbientOcclusionTexture = textureLoader.load('/assets/p3_ao.webp')
    const p3MetalnessTexture = textureLoader.load('/assets/p3_metallic.webp')
    const p3NormalTexture = textureLoader.load('/assets/p3_normal.webp')
    const p3RoughnessTexture = textureLoader.load('/assets/p3_roughness.webp')
    const p3AlbedoTexture = textureLoader.load('/assets/p3_albedo.webp')
    //planet 4
    const p4AmbientOcclusionTexture = textureLoader.load('/assets/p4_ao.webp')
    const p4MetalnessTexture = textureLoader.load('/assets/p4_metallic.webp')
    const p4NormalTexture = textureLoader.load('/assets/p4_normal.webp')
    const p4RoughnessTexture = textureLoader.load('/assets/p4_roughness.webp')
    const p4AlbedoTexture = textureLoader.load('/assets/p4_albedo.webp')

    /**
     *  Lights
     */
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2)
    scene.add(hemisphereLight)

    const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
    pointLight.position.set( -3, 3, 5 );
    scene.add( pointLight )

    const pointLight1 = new THREE.PointLight( 0x00ffff, 1, 100 );
    pointLight.position.set( 3, 1, -2 );
    scene.add( pointLight1 )

    const pointLight2 = new THREE.PointLight( 0xff6030, 10, 100 );
    pointLight.position.set( 1, -2, 1 );
    scene.add( pointLight2 )

    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
    // scene.add(pointLightHelper)

    // const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 0.5)
    // scene.add(pointLightHelper1)

    // const pointLightHelper2 = new THREE.PointLightHelper(pointLight1, 0.5)
    // scene.add(pointLightHelper2)

    // /**
    //  *  Galaxy
    //  */
    const parameters = {}
    parameters.count = 100000
    parameters.size = 0.01
    parameters.radius = 5
    parameters.branches = 3
    parameters.spin = 1
    parameters.randomness = 0.2
    parameters.randomnessPower = 4
    parameters.insideColor = '#ff6030'
    parameters.outsideColor = '#1b3984'

    let geometry = null
    let material = null
    let points = null

    const generateGalaxy = () => {

        // Destroy old galaxy
        if (points !== null) {
            geometry.dispose()
            material.dispose()
            scene.remove(points)
        }

        /**
         *  Geometry
         */
        geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)

        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle = (i % parameters.branches) /parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

            positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / parameters.radius)

            colors[i3 + 0] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))//3 nb de valeurs par vertex xyz
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        /**
         *  Material
         */
        material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })

        /**
         *  Points
         */
        points = new THREE.Points(geometry, material)
        scene.add(points)
    }
    generateGalaxy()

    /**
     *  Planets
     */
    const planet1 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.4, 15, 15),
        new THREE.MeshStandardMaterial({
            aoMap: p1AmbientOcclusionTexture,
            metalnessMap: p1MetalnessTexture,
            roughnessMap: p1RoughnessTexture,
            normalMap: p1NormalTexture,
            map: p1AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet1.position.x = - 2
    planet1.position.y =  2
    planet1.position.z = 0

    const planet2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.2, 10, 10),
        new THREE.MeshStandardMaterial({
            aoMap: p2AmbientOcclusionTexture,
            metalnessMap: p2MetalnessTexture,
            roughnessMap: p2RoughnessTexture,
            normalMap: p2NormalTexture,
            map: p2AlbedoTexture,
            emissiveMap: p2EmissiveTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet2.position.x = -3
    planet2.position.y =  0
    planet2.position.z = -2

    const planet3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.38, 10, 10),
        new THREE.MeshStandardMaterial({
            aoMap: p3AmbientOcclusionTexture,
            metalnessMap: p3MetalnessTexture,
            roughnessMap: p3RoughnessTexture,
            normalMap: p3NormalTexture,
            map: p3AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet3.position.x = 2.5
    planet3.position.y = -1
    planet3.position.z = 2

    const planet4 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({
            aoMap: p4AmbientOcclusionTexture,
            metalnessMap: p4MetalnessTexture,
            roughnessMap: p4RoughnessTexture,
            normalMap: p4NormalTexture,
            map: p4AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet4.position.x = 1.5
    planet4.position.y = 1
    planet4.position.z = - 2.5

    scene.add(planet1, planet2, planet3, planet4)

    /**
     *  Raycaster
     */
    const raycaster = new THREE.Raycaster()

    /**
     *  Mouse
     */
    const mouse = new THREE.Vector2()
    window.addEventListener('mousemove', (_event) => {
        mouse.x = (_event.clientX / sizes.width) * 2 - 1
        mouse.y = - (_event.clientY / sizes.height) * 2 + 1
    })

    /**
     *  Modal events
     */
    const modal = document.querySelector('.modal')
    const modal2 = document.querySelector('.modal2')
    const modal3 = document.querySelector('.modal3')
    const modal4 = document.querySelector('.modal4')
    let toggleClose = document.querySelector('.toggle-close')
    let toggleClose2 = document.querySelector('.toggle-close2')
    let toggleClose3 = document.querySelector('.toggle-close3')
    let toggleClose4 = document.querySelector('.toggle-close4')

    window.addEventListener('click', () =>
    {
        if(currentIntersect)
        {
            switch(currentIntersect.object)
            {
                case planet1:
                    if(camera.position.z < 4 && modal4.style.display == "none" &&  modal3.style.display == "none" && modal2.style.display == "none" && modal.style.display == "none" ) {
                        modal.style.display = "block"
                        gsap.to(planet1.position, {
                            duration: 2,
                            x: 0,
                            y: 0,
                            z: 0,
                            ease: 'power3.inOut'
                        })
                        gsap.to(camera.position, {
                            duration: 2,
                            transformOrigin: "center center",
                            x: -1,
                            y: 0,
                            z: -1,
                            ease: 'power3.inOut'
                        })
                    } else {
                        modal.style.display = "none"
                    }
                    break

                case planet2:
                    if(camera.position.z < 4 && modal4.style.display == "none" &&  modal3.style.display == "none" && modal2.style.display == "none" && modal.style.display == "none" ) {
                        modal2.style.display = "block"
                        gsap.to(planet2.position, {
                            duration: 2,
                            x: 0,
                            y: 0,
                            z: 0,
                            ease: 'power3.inOut'
                        })
                        gsap.to(camera.position, {
                            duration: 2,
                            transformOrigin: "center center",
                            x: -1,
                            y: 0,
                            z: -1,
                            ease: 'power3.inOut'
                        })
                    } else {
                        modal2.style.display = "none"
                    }              
                    break

                case planet3:
                    if(camera.position.z < 4 && modal4.style.display == "none" &&  modal3.style.display == "none" && modal2.style.display == "none" && modal.style.display == "none" ) {
                        modal3.style.display = "block"
                        gsap.to(planet3.position, {
                            duration: 2,
                            x: 0,
                            y: 0,
                            z: 0,
                            ease: 'power3.inOut'
                        })
                        gsap.to(camera.position, {
                            duration: 2,
                            transformOrigin: "center center",
                            x: -1,
                            y: 0,
                            z: -1,
                            ease: 'power3.inOut'
                        })
                    } else {
                        modal3.style.display = "none"
                    }
                    break

                case planet4:
                    if(camera.position.z < 4 && modal4.style.display == "none" &&  modal3.style.display == "none" && modal2.style.display == "none" && modal.style.display == "none" ) {
                        modal4.style.display = "block"
                        gsap.to(planet4.position, {
                            duration: 2,
                            x: 0,
                            y: 0,
                            z: 0,
                            ease: 'power3.inOut'
                        })
                        gsap.to(camera.position, {
                            duration: 2,
                            transformOrigin: "center center",
                            x: -1,
                            y: 0,
                            z: -1,
                            ease: 'power3.inOut'
                        })
                    } else {
                        modal4.style.display = "none"
                    }
                    break
            }
        }
    })

    document.querySelector('.openModal').addEventListener('click', () => {
        if (modal.style.height == '5vh') {
            modal.style.height = '100vh'
            document.querySelector('.modalTitle').style.display = 'none'
            document.querySelector('.modalContent').style.display= 'block'
        } else {
            modal.style.height = '5vh'
            document.querySelector('.modalTitle').style.display = 'block'
            document.querySelector('.modalContent').style.display= 'none'
            // gsap.to(camera.position, {
            //     duration: 2,
            //     x: 3,
            //     y: 3,
            //     z: 3,
            //     ease: 'power3.inOut'
            // })
        }
    })

    document.querySelector('.openModal2').addEventListener('click', () => {
        if (modal2.style.height == '5vh') {
            modal2.style.height = '100vh'
            document.querySelector('.modalTitle2').style.display = 'none'
            document.querySelector('.modalContent2').style.display= 'block'
        } else {
            modal2.style.height = '5vh'
            document.querySelector('.modalTitle2').style.display = 'block'
            document.querySelector('.modalContent2').style.display= 'none'
            // gsap.to(camera.position, {
            //     duration: 2,
            //     x: 3,
            //     y: 3,
            //     z: 3,
            //     ease: 'power3.inOut'
            // })
        }
    })
    
    document.querySelector('.openModal3').addEventListener('click', () => {
        if (modal3.style.height == '5vh') {
            modal3.style.height = '100vh'
            document.querySelector('.modalTitle3').style.display = 'none'
            document.querySelector('.modalContent3').style.display= 'block'
        } else {
            modal3.style.height = '5vh'
            document.querySelector('.modalTitle3').style.display = 'block'
            document.querySelector('.modalContent3').style.display= 'none'
            // gsap.to(camera.position, {
            //     duration: 2,
            //     x: 3,
            //     y: 3,
            //     z: 3,
            //     ease: 'power3.inOut'
            // })
        }
    })

    document.querySelector('.openModal4').addEventListener('click', () => {
        if (modal4.style.height == '5vh') {
            modal4.style.height = '100vh'
            document.querySelector('.modalTitle4').style.display = 'none'
            document.querySelector('.modalContent4').style.display= 'block'
        } else {
            modal4.style.height = '5vh'
            document.querySelector('.modalTitle4').style.display = 'block'
            document.querySelector('.modalContent4').style.display= 'none'
            // gsap.to(camera.position, {
            //     duration: 2,
            //     x: 3,
            //     y: 3,
            //     z: 3,
            //     ease: 'power3.inOut'
            // })
        }
    })

    toggleClose.addEventListener('click', () => {
        modal.style.display = 'none';
        gsap.to(planet1.position, {
            duration: 2,
            x: -2,
            y: 2,
            z: 0,
            ease: 'power3.inOut'
        })
        gsap.to(camera.position, {
            duration: 2,
            x: 3,
            y: 3,
            z: 3,
            ease: 'power3.inOut'
        })
    })
    toggleClose2.addEventListener('click', () => {
        modal2.style.display = 'none';
        gsap.to(planet2.position, {
            duration: 2,
            x: -3,
            y: 0,
            z: 2,
            ease: 'power3.inOut'
        })
        gsap.to(camera.position, {
            duration: 2,
            x: 3,
            y: 3,
            z: 3,
            ease: 'power3.inOut'
        })
    })
    toggleClose3.addEventListener('click', () => {
        modal3.style.display = 'none';
        gsap.to(planet3.position, {
            duration: 2,
            x: -2.5,
            y: -1,
            z: 2,
            ease: 'power3.inOut'
        })
        gsap.to(camera.position, {
            duration: 2,
            x: 3,
            y: 3,
            z: 3,
            ease: 'power3.inOut'
        })
    })
    toggleClose4.addEventListener('click', () => {
        modal4.style.display = 'none';
        gsap.to(planet4.position, {
            duration: 2,
            x: 1.5,
            y: 1,
            z: -2.5,
            ease: 'power3.inOut'
        })
        gsap.to(camera.position, {
            duration: 2,
            x: 3,
            y: 3,
            z: 3,
            ease: 'power3.inOut'
        })
    })

    document.addEventListener("click", function(event) {
          if (
            event.target.matches(".toggleClose") ||
            !event.target.closest(".modal")
          ) {
            closeModal()
          }
        },
        false
      )
      
      function closeModal() {
        document.querySelector(".modal").style.display = "none"
        // gsap.to(camera.position, {
        //     duration: 2,
        //     x: 3,
        //     y: 3,
        //     z: 3,
        //     ease: 'power3.inOut'
        // })
      }

    document.addEventListener("click", function(event) {
          if (
            event.target.matches(".toggleClose2") ||
            !event.target.closest(".modal2")
          ) {
            closeModal2()
          }
        },
        false
      )
      
      function closeModal2() {
        document.querySelector(".modal2").style.display = "none"
        // gsap.to(camera.position, {
        //     duration: 2,
        //     x: 3,
        //     y: 3,
        //     z: 3,
        //     ease: 'power3.inOut'
        // })
      }

    document.addEventListener("click", function(event) {
          if (
            event.target.matches(".toggleClose3") ||
            !event.target.closest(".modal3")
          ) {
            closeModal3()
          }
        },
        false
      )
      
      function closeModal3() {
        document.querySelector(".modal3").style.display = "none"
        // gsap.to(camera.position, {
        //     duration: 2,
        //     x: 3,
        //     y: 3,
        //     z: 3,
        //     ease: 'power3.inOut'
        // })
      }

    document.addEventListener("click", function(event) {
          if (
            event.target.matches(".toggleClose4") ||
            !event.target.closest(".modal4")
          ) {
            closeModal4()
          }
        },
        false
      )
      
      function closeModal4() {
        document.querySelector(".modal4").style.display = "none"
        // gsap.to(camera.position, {
        //     duration: 2,
        //     x: 3,
        //     y: 3,
        //     z: 3,
        //     ease: 'power3.inOut'
        // })
      }

    /**
     *  Group
     */
    const group = new THREE.Group()
    group.add( planet1 )
    group.add( planet2 )
    group.add( planet3 )
    group.add( planet4 )
    group.add( points )
    
    scene.add( group )

    /**
     *  Tweaks
     */
    //  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
    //  gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
    //  gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
    //  gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     *  Explore
     */
    const explore = document.querySelector('.explore')
    let explorer = true

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 3
    camera.position.y = 3
    camera.position.z = 20
    scene.add(camera)

    /**
     * Explore click
     */
    explore.addEventListener('click', () => {
        console.log('click');
        explorer = !explorer
        if (!explorer) {
            gsap.to(camera.position, {
                duration: 2,
                z: explorer ? 20 : 3,
                ease: 'power3.inOut',
            })
            explore.innerHTML = explorer ? "Commencer l'exploration" : "Revenir en arrière"
        } else if (explorer) {
            gsap.to(camera.position, {
                duration: 2,
                z: explorer ? 20 : 3,
                ease: 'power3.inOut',
            })
            explore.innerHTML = explorer ? "Commencer l'exploration" : "Revenir en arrière"
        }
        
    })

    /**
     *  Background
     */
    const loader = new THREE.TextureLoader();
    loader.load('/assets/etoiles.webp' , function(texture) {
        scene.background = texture;  
    });


    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * CurrentIntersect
     */
    let currentIntersect = null

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()

        // Cast a ray
        raycaster.setFromCamera(mouse, camera)
        
        const objectsToTest = [planet1, planet2, planet3, planet4]
    
        const intersects = raycaster.intersectObjects(objectsToTest)

        //group rotation
        if(intersects.length) {
            if(!currentIntersect) {
                group.rotation.y += 0
            }
            currentIntersect = intersects[0]
        } else { 
            currentIntersect = null
            group.rotation.y += 0.002
        } 

        if(camera.position.z > 4) {
            group.rotation.y += 0.002
        }

        // mouse pointer cursor
        if (currentIntersect && camera.position.z < 4) { 
            document.body.style.cursor = 'pointer' 
        } else { 
            document.body.style.cursor = 'default' 
        }
        
        // planets rotation
        planet1.rotation.x += 0.008
        planet1.rotation.y += 0.008
        planet2.rotation.x += 0.01
        planet2.rotation.z += 0.01
        planet3.rotation.x += 0.005
        planet3.rotation.y += 0.007
        planet4.rotation.y += 0.008

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()

} else if (mediaQueryListMobile.matches) {

    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    const modal = document.querySelector('.modal')
    const modal2 = document.querySelector('.modal2')
    const modal3 = document.querySelector('.modal3')
    const modal4 = document.querySelector('.modal4')
    modal.style.display = "block"
    modal2.style.display = "block"
    modal3.style.display = "block"
    modal4.style.display = "block"
    
    // Scene
    const scene = new THREE.Scene()
    
    /**
     *  Textures
     */
    const textureLoader = new THREE.TextureLoader()

        //planet 1
        const p1AmbientOcclusionTexture = textureLoader.load('assets/p1_ao.webp')
        const p1MetalnessTexture = textureLoader.load('assets/p1_metallic.webp')
        const p1NormalTexture = textureLoader.load('assets/p1_normal.webp')
        const p1RoughnessTexture = textureLoader.load('assets/p1_roughness.webp')
        const p1AlbedoTexture = textureLoader.load('assets/p1_albedo.webp')
        //planet 2
        const p2AmbientOcclusionTexture = textureLoader.load('/assets/p2_ao.webp')
        const p2MetalnessTexture = textureLoader.load('/assets/p2_metallic.webp')
        const p2NormalTexture = textureLoader.load('/assets/p2_normal.webp')
        const p2RoughnessTexture = textureLoader.load('/assets/p2_roughness.webp')
        const p2AlbedoTexture = textureLoader.load('/assets/p2_albedo.webp')
        const p2EmissiveTexture = textureLoader.load('/assets/p2_emissive.webp')
        //planet 3
        const p3AmbientOcclusionTexture = textureLoader.load('/assets/p3_ao.webp')
        const p3MetalnessTexture = textureLoader.load('/assets/p3_metallic.webp')
        const p3NormalTexture = textureLoader.load('/assets/p3_normal.webp')
        const p3RoughnessTexture = textureLoader.load('/assets/p3_roughness.webp')
        const p3AlbedoTexture = textureLoader.load('/assets/p3_albedo.webp')
        //planet 4
        const p4AmbientOcclusionTexture = textureLoader.load('/assets/p4_ao.webp')
        const p4MetalnessTexture = textureLoader.load('/assets/p4_metallic.webp')
        const p4NormalTexture = textureLoader.load('/assets/p4_normal.webp')
        const p4RoughnessTexture = textureLoader.load('/assets/p4_roughness.webp')
        const p4AlbedoTexture = textureLoader.load('/assets/p4_albedo.webp')
    
    // Lights
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2)
    scene.add(hemisphereLight)
    
    const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
    pointLight.position.set( -3, 3, 5 );
    scene.add( pointLight )
    
    const pointLight1 = new THREE.PointLight( 0x00ffff, 1, 100 );
    pointLight.position.set( 3, 1, -2 );
    scene.add( pointLight1 )
    
    const pointLight2 = new THREE.PointLight( 0xff6030, 10, 100 );
    pointLight.position.set( 1, -2, 1 );
    scene.add( pointLight2 )

    
    // /**
    //  *  Galaxy
    //  */
    const parameters = {}
    parameters.count = 100000
    parameters.size = 0.01
    parameters.radius = 5
    parameters.branches = 3
    parameters.spin = 1
    parameters.randomness = 0.2
    parameters.randomnessPower = 4
    parameters.insideColor = '#ff6030'
    parameters.outsideColor = '#1b3984'
    
    let geometry = null
    let material = null
    let points = null
    
    const generateGalaxy = () => {
    
        // Destroy old galaxy
        if (points !== null) {
            geometry.dispose()
            material.dispose()
            scene.remove(points)
        }
    
        /**
         *  Geometry
         */
        geometry = new THREE.BufferGeometry()
    
        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)
    
        const colorInside = new THREE.Color(parameters.insideColor)
        const colorOutside = new THREE.Color(parameters.outsideColor)
    
        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3
    
            // Position
            const radius = Math.random() * parameters.radius
            const spinAngle = radius * parameters.spin
            const branchAngle = (i % parameters.branches) /parameters.branches * Math.PI * 2
    
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    
            positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    
            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / parameters.radius)
    
            colors[i3 + 0] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
        /**
         *  Material
         */
        material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        })
    
        /**
         *  Points
         */
        points = new THREE.Points(geometry, material)
        scene.add(points)
    }
    generateGalaxy()
    
    /**
     *  Planets
     */
    const planet1 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.4, 15, 15),
        new THREE.MeshStandardMaterial({
            aoMap: p1AmbientOcclusionTexture,
            metalnessMap: p1MetalnessTexture,
            roughnessMap: p1RoughnessTexture,
            normalMap: p1NormalTexture,
            map: p1AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
        
    )
    planet1.position.x = - 2
    planet1.position.y =  2
    planet1.position.z = 0

    
    const planet2 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.2, 10, 10),
        new THREE.MeshStandardMaterial({
            aoMap: p2AmbientOcclusionTexture,
            metalnessMap: p2MetalnessTexture,
            roughnessMap: p2RoughnessTexture,
            normalMap: p2NormalTexture,
            map: p2AlbedoTexture,
            emissiveMap: p2EmissiveTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet2.position.x = -3
    planet2.position.y =  0
    planet2.position.z = -2

    
    const planet3 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.38, 10, 10),
        new THREE.MeshStandardMaterial({
            aoMap: p3AmbientOcclusionTexture,
            metalnessMap: p3MetalnessTexture,
            roughnessMap: p3RoughnessTexture,
            normalMap: p3NormalTexture,
            map: p3AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet3.position.x = 2.5
    planet3.position.y = -1
    planet3.position.z = 2

    
    const planet4 = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({
            aoMap: p4AmbientOcclusionTexture,
            metalnessMap: p4MetalnessTexture,
            roughnessMap: p4RoughnessTexture,
            normalMap: p4NormalTexture,
            map: p4AlbedoTexture,
            metalness: 0.03,
            roughness: 0.04,
        })
    )
    planet4.position.x = 1.5
    planet4.position.y = 1
    planet4.position.z = - 2.5

    scene.add(planet1, planet2, planet3, planet4)
    
    /**
     *  Group
     */
     const group = new THREE.Group()
     group.add( planet1 )
     group.add( planet2 )
     group.add( planet3 )
     group.add( planet4 )
     group.add( points )
     
     scene.add( group )
    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    
        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    /**
     *  Explore
     */
    const explore = document.querySelector('.explore')
    let explorer = true

    /**
     *  Scrolldown & up
     */

    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x =0
    camera.position.y = 3
    camera.position.z = 30
    scene.add(camera)
    
    /**
     * Explore click
     */
     explore.addEventListener('click', () => {
        
        explorer = !explorer
        if (!explorer) {
            gsap.to(camera.position, {
                duration: 2,
                z: explorer ? 30 : 8,
                y: explorer ? 3 : 2,
                ease: 'power3.inOut',
            })
            explore.innerHTML = explorer ? "Commencer l'exploration" : "Revenir en arrière"
        } else if (explorer) {
            gsap.to(camera.position, {
                duration: 2,
                z: explorer ? 30 : 8,
                ease: 'power3.inOut',
            })
            explore.innerHTML = explorer ? "Commencer l'exploration" : "Revenir en arrière"
        }
        
    })

    /**
     *  Click on Zoom
     */

    const container = document.querySelector('.container')
    const scroller = document.querySelector('.scroller')
    // const home = document.querySelector('.home')
    const scrolldown = document.querySelector('.scrolldown')
    scrolldown.style.display = 'none'
 

    explore.addEventListener('click', () =>
    {
        
        if(camera.position.z > 10) {
            scrolldown.style.display = 'block'
            container.classList.replace("container" , "scroller");
        } else {
            container.style.overflow = 'hidden'
            scrolldown.style.display = 'none'
            container.classList.replace("scroller" , "container");
            
        }
    })

    /**
     *  Background
     */
    const loader = new THREE.TextureLoader();
    loader.load('/assets/etoiles.webp' , function(texture) {
        scene.background = texture;  
    });
    
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    /**
     * Animate
     */
    const clock = new THREE.Clock()
    
    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
    
        group.rotation.y += 0.002

        // planets rotation
        planet1.rotation.x += 0.008
        planet1.rotation.y += 0.008
        planet2.rotation.x += 0.01
        planet2.rotation.z += 0.01
        planet3.rotation.x += 0.005
        planet3.rotation.y += 0.007
        planet4.rotation.y += 0.008
    
        // Render
        renderer.render(scene, camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }
    
    tick()
}