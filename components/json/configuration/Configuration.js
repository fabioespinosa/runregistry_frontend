import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { generateJson } from '../../../ducks/json/configuration';
import stringify from 'json-stringify-pretty-compact';

const TextEditor = dynamic(
    import('../../common/ClassifierEditor/JSONEditor/JSONEditor'),
    {
        ssr: false
    }
);

class Configuration extends Component {
    state = {
        current_configuration: `{
    "and": [
        {
            "or": [
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018A/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018B/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018C/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018D/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018E/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018F/DQM"]},
                {"==": [{"var": "dataset.name"}, "/PromptReco/Collisions2018G/DQM"]}
            ]
        },
        { ">=": [{ "var": "run.oms.energy" }, 6000] },
        { "<=": [{ "var": "run.oms.energy" }, 7000] },
        { ">=": [{ "var": "run.oms.b_field" }, 3.7] },
        { "in": [{ "var": "run.oms.injection_scheme" }, "25ns"] },
        { "==": [{ "in": [{ "var": "run.oms.hlt_key" }, "WMass"] }, false] },

        { "==": [{ "var": "lumisection.rr.dt-dt" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.csc-csc" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.l1t-l1tmu" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.hlt-hlt" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.tracker-pixel" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.tracker-strip" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.tracker-track" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.ecal-ecal" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.ecal-es" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.hcal-hcal" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.muon-muon" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.jetmet-jetmet" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.lumi-lumi" }, "GOOD"] },
        { "==": [{ "var": "lumisection.rr.dc-lowlumi" }, "BAD"] },

        { "==": [{ "var": "lumisection.oms.cms_active" }, true] },
        { "==": [{ "var": "lumisection.oms.bpix_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.fpix_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.tibtid_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.tecm_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.tecp_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.castor_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.tob_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.ebm_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.ebp_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.eem_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.eep_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.esm_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.esp_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.hbhea_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.hbheb_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.hbhec_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.hf_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.ho_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.dtm_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.dtp_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.dt0_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.cscm_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.cscp_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.rpc_ready" }, true] },
        { "==": [{ "var": "lumisection.oms.beam1_present" }, true] },
        { "==": [{ "var": "lumisection.oms.beam2_present" }, true] },
        { "==": [{ "var": "lumisection.oms.beam1_stable" }, true] },
        { "==": [{ "var": "lumisection.oms.beam2_stable" }, true] }
    ]
}`
    };

    changeValue = new_configuration => {
        this.setState({ current_configuration: new_configuration });
    };

    getDisplayedJSON(json) {
        return stringify(json);
    }

    render() {
        const { current_configuration } = this.state;
        const { generateJson, current_json } = this.props;
        return (
            <div className="configuration">
                <h4>Configuration</h4>
                <TextEditor
                    onChange={this.changeValue}
                    value={current_configuration}
                    lan="javascript"
                    theme="github"
                />
                <Button onClick={() => generateJson(current_configuration)}>
                    Generate JSON
                </Button>
                <TextEditor
                    onChange={() => {}}
                    value={this.getDisplayedJSON(current_json)}
                    lan="javascript"
                    theme="github"
                />
                <style jsx>{`
                    .configuration {
                        width: 1000px;
                    }
                `}</style>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        current_json: state.json.configuration.current_json
    };
}

export default connect(
    mapStateToProps,
    { generateJson }
)(Configuration);
