---
permalink: /Research/
title: "Research"
classes: wide
---

<p align="">
I am an observational astrophysicist who studies the growth of cosmic structure and galaxy evolution using large survey data.
My research program is organized around three interconnected pillars:
(1) multi-probe cluster cosmology with wide-field surveys,
(2) constraining baryonic feedback to recover small-scale weak-lensing information, and
(3) refining the galaxy–halo connection across mass scales.
These pillars are supported by simulation and machine-learning–based inference tools developed for current and future surveys.
</p>

<h2 id="multi-probe-cluster-cosmology">Multi-probe cluster cosmology with galaxy surveys</h2>
<p align="">
I develop and validate a framework for cluster cosmology that treats galaxy clusters as part of the full large-scale structure rather than as isolated objects.
This approach not only enables precision constraints from photometrically selected clusters, but also naturally combines cluster information with other probes in wide imaging surveys.
Specifically, I jointly model the abundance of galaxy clusters and a set of large-scale two-point correlations: galaxy clustering, galaxy–cluster cross-correlations, cluster clustering, and cluster–galaxy weak lensing.
I have led this analysis for DES Year 1
(<a href="https://ui.adsabs.harvard.edu/abs/2020arXiv200810757T/abstract">To, Krause et al. 2020a</a>,
<a href="https://ui.adsabs.harvard.edu/abs/2021PhRvL.126n1301T/abstract">To, Krause et al. 2020b</a>)
and DES Year 3
(<a href="https://ui.adsabs.harvard.edu/abs/2025PhRvD.112f3537T/abstract">To et al. 2025</a>,
<a href="https://ui.adsabs.harvard.edu/abs/2025PhRvD.112h3535A/abstract">DES et al. 2025</a>).
I am now leading the final DES multiprobe analysis combining clusters, galaxies, weak lensing, and Type Ia supernovae to test evolving dark energy.
</p>


<h2 id="baryonic-feedback">Baryonic feedback and small-scale weak lensing</h2>
<p align="">
Baryonic feedback from processes such as AGN activity and supernovae redistributes matter on nonlinear scales and currently limits the cosmological information we can extract from small-scale weak-lensing measurements.
Galaxy clusters uniquely encode this baryon physics and therefore provide a natural calibration channel for weak-lensing cosmology with surveys like Rubin LSST and Roman.
</p>

<p align="">
In <a href="https://ui.adsabs.harvard.edu/abs/2024JCAP...03..037T/abstract">To et al. 2024b</a>,
I developed a fully differentiable framework that links baryonic physics—encoded in cluster mass–tSZ scaling relations—to its impact on the total matter distribution.
Using SPT and DES data, this approach is expected to constrain baryonic feedback at the <em>∼2&nbsp;%</em> level and to recover nearly one-third of the statistical power currently excluded from weak-lensing analyses, effectively equivalent to doubling the survey area.
A student I mentored, Nihar Dalal, has applied this framework to ACT-detected clusters with DES weak-lensing mass calibration
(<a href="https://ui.adsabs.harvard.edu/abs/2025arXiv250704476D/abstract">Dalal et al. 2025</a>),
delivering the first observational constraint on baryonic feedback from tSZ-selected clusters and hinting that feedback may be stronger than expected.
</p>


<h2 id="galaxy-halo-connection">Galaxy–halo connection across mass scales</h2>
<div class="square">
  <figure style="width: 500px" class="align-right">
    <a href="{{ site.url }}{{ site.baseurl }}/assets/images/decade.png" class="image resize" data-lightbox="image-1" data-title="Constraints on the galaxy–halo connection.">
      <img src="{{ site.url }}{{ site.baseurl }}/assets/images/decade.png" align="left">
    </a>
  </figure>

  <p align="">
  When using galaxy properties to infer the underlying dark matter distribution and constrain cosmological parameters, it is crucial to understand the connection between galaxies and their host dark matter halos.
  I study this galaxy–halo connection across mass scales using weak gravitational lensing with careful control of systematics.
  </p>

  <p align="">
  At high halo masses, I have constrained the galaxy–halo connection using galaxy clusters in the Sloan Digital Sky Survey (SDSS;
  <a href="https://ui.adsabs.harvard.edu/abs/2020ApJ...897...15T/abstract">To et al. 2020b</a>).
  At low masses, I use dwarf galaxies from the Dark Energy Spectroscopic Instrument (DESI;
  <a href="https://ui.adsabs.harvard.edu/abs/2025arXiv250920458T/abstract">To et al. 2025b</a>),
  obtaining some of the first weak-lensing measurements around spectroscopically confirmed dwarfs.
  Together, these studies map the galaxy–halo connection from clusters down to dwarfs, providing key inputs for tests of dark matter and models of galaxy formation.
  </p>
</div>

<h2 id="methods-tools">Methods and tools: simulations and ML-based inference</h2>
<p align="">
To make these analyses feasible for current and next-generation surveys, I also develop computational tools and simulations.
In particular, we have built a neural-network–based likelihood evaluation tool
(<a href="https://ui.adsabs.harvard.edu/abs/2023JCAP...01..016T/abstract">To et al. 2022</a>)
that emulates the mapping between cosmological parameters and summary statistics, enabling fast and accurate Bayesian inference.
These methods are validated on DES Year 1 data as well as simulated Rubin LSST Year 10 data and are being integrated into the cluster cosmology and baryonic-feedback programs described above.
I am also involved in the development of high-fidelity mock catalogs for DES, Roman, and LSST, which provide the end-to-end validation needed for precision cosmology (See
<a href="https://chunhaoto.com/cardinalsim/" target="_blank" rel="noopener noreferrer">the Cardinal mock catalog page</a> for details).
</p>

